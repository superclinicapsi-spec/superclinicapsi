import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Cliente admin com service_role key para criar usuários
// Instanciação lazy para evitar erro durante o build
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdmin) {
        supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );
    }
    return supabaseAdmin;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { patientId, familyName, email, password, psychologistId } = body;

        // Validações
        if (!patientId || !email || !password || !psychologistId) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Senha deve ter no mínimo 6 caracteres' },
                { status: 400 }
            );
        }

        // 1. Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await getSupabaseAdmin().auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Confirma email automaticamente
            user_metadata: {
                full_name: familyName,
                role: 'family'
            }
        });

        if (authError) {
            // Verifica se usuário já existe
            if (authError.message.includes('already been registered')) {
                return NextResponse.json(
                    { error: 'Este email já está cadastrado' },
                    { status: 409 }
                );
            }
            throw authError;
        }

        const userId = authData.user.id;

        // 2. Criar perfil do usuário
        const { error: profileError } = await getSupabaseAdmin()
            .from('users_profile')
            .insert({
                id: userId,
                role: 'family',
                created_at: new Date().toISOString()
            });

        if (profileError) {
            // Rollback: deletar usuário se falhar
            await getSupabaseAdmin().auth.admin.deleteUser(userId);
            throw profileError;
        }

        // 3. Criar vínculo família-paciente
        const { error: accessError } = await getSupabaseAdmin()
            .from('family_portal_access')
            .insert({
                user_id: userId,
                patient_id: patientId,
                psychologist_id: psychologistId,
                family_name: familyName,
                family_email: email,
                must_change_password: true,
                access_level: 'view'
            });

        if (accessError) {
            // Rollback completo
            await getSupabaseAdmin().from('users_profile').delete().eq('id', userId);
            await getSupabaseAdmin().auth.admin.deleteUser(userId);
            throw accessError;
        }

        return NextResponse.json({
            success: true,
            message: 'Acesso criado com sucesso',
            userId,
            email
        });

    } catch (error: any) {
        console.error('Erro ao criar acesso família:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// GET: Listar acessos de um paciente
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json(
                { error: 'patientId é obrigatório' },
                { status: 400 }
            );
        }

        const { data, error } = await getSupabaseAdmin()
            .from('family_portal_access')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ accesses: data });

    } catch (error: any) {
        console.error('Erro ao listar acessos:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        );
    }
}

// DELETE: Revogar acesso
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const accessId = searchParams.get('accessId');

        if (!accessId) {
            return NextResponse.json(
                { error: 'accessId é obrigatório' },
                { status: 400 }
            );
        }

        // Buscar o acesso para pegar o user_id
        const { data: access } = await getSupabaseAdmin()
            .from('family_portal_access')
            .select('user_id')
            .eq('id', accessId)
            .single();

        if (access) {
            // Deletar acesso
            await getSupabaseAdmin()
                .from('family_portal_access')
                .delete()
                .eq('id', accessId);

            // Verificar se usuário tem outros acessos
            const { data: otherAccess } = await getSupabaseAdmin()
                .from('family_portal_access')
                .select('id')
                .eq('user_id', access.user_id);

            // Se não tem outros acessos, deletar usuário
            if (!otherAccess || otherAccess.length === 0) {
                await getSupabaseAdmin().from('users_profile').delete().eq('id', access.user_id);
                await getSupabaseAdmin().auth.admin.deleteUser(access.user_id);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Erro ao revogar acesso:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        );
    }
}
