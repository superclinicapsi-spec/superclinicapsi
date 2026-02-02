'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserSubscription(formData: FormData) {
    const supabase = await createClient();

    // 1. Verify Admin Access
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { data: adminProfile } = await supabase
        .from('users_profile')
        .select('role')
        .eq('id', user.id)
        .single();

    if (adminProfile?.role !== 'platform_admin') {
        return { error: 'Forbidden: Admin access required' };
    }

    // 2. Extract Data
    const targetUserId = formData.get('userId') as string;
    const action = formData.get('action') as string; // 'activate', 'deactivate', 'trial'

    if (!targetUserId || !action) {
        return { error: 'Missing required fields' };
    }

    // 3. Define Updates based on Action
    let updates: any = {
        updated_at: new Date().toISOString(),
    };

    const now = new Date();

    switch (action) {
        case 'activate':
            updates.status = 'active';
            updates.plan_type = 'monthly';
            // Set to 1 month from now
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            updates.ends_at = nextMonth.toISOString();
            updates.starts_at = now.toISOString();
            break;

        case 'deactivate':
            updates.status = 'canceled';
            updates.ends_at = now.toISOString(); // End immediately
            break;

        case 'trial':
            updates.status = 'trial';
            updates.plan_type = 'monthly';
            // Set to 7 days from now
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);
            updates.ends_at = nextWeek.toISOString();
            updates.starts_at = now.toISOString();
            break;

        default:
            return { error: 'Invalid action' };
    }

    // 4. Perform DB Update (Upsert)
    // Check if subscription exists
    const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', targetUserId)
        .single();

    let error;

    if (existingSub) {
        const result = await supabase
            .from('subscriptions')
            .update(updates)
            .eq('user_id', targetUserId);
        error = result.error;
    } else {
        // Create new
        const result = await supabase
            .from('subscriptions')
            .insert({
                user_id: targetUserId,
                ...updates,
            });
        error = result.error;
    }

    if (error) {
        console.error('Error updating subscription:', error);
        return { error: 'Database error' };
    }

    // 5. Revalidate Cache
    revalidatePath('/admin/users');
    return { success: true };
}
