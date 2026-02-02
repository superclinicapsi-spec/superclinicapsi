import NextAppointments from '@/components/dashboard/NextAppointments';
import FinancialSummary from '@/components/dashboard/FinancialSummary';
import QuickActions from '@/components/dashboard/QuickActions';
import StatsCards from '@/components/dashboard/StatsCards';

export default async function DashboardPage() {
    const mockAppointments = [
        {
            id: '1',
            patient: { name: 'João Silva', photo_url: '' },
            scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            location: { name: 'Clínica Centro' },
            status: 'confirmed' as const,
        },
        {
            id: '2',
            patient: { name: 'Maria Santos', photo_url: '' },
            scheduled_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            location: { name: 'Domicílio' },
            status: 'pending' as const,
        },
        {
            id: '3',
            patient: { name: 'Pedro Costa', photo_url: '' },
            scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            location: { name: 'Clínica Norte' },
            status: 'confirmed' as const,
        },
    ];

    const mockFinancialData = {
        income: 8500,
        expenses: 2300,
        unpaidSessions: 3,
    };

    return (
        <div className="min-h-screen bg-background-secondary">
            {/* Header Minimalista */}
            <header className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-foreground">Clinical</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-full bg-foreground text-white flex items-center justify-center text-sm font-medium">
                                A
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="space-y-8">
                    {/* Welcome */}
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-1">Bem-vindo de volt</h2>
                        <p className="text-muted">Aqui está um resumo do seu dia</p>
                    </div>

                    {/* Stats */}
                    <StatsCards
                        totalPatients={24}
                        appointmentsToday={6}
                        monthRevenue={8500}
                        activeSessions={18}
                    />

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Ações rápidas</h3>
                        <QuickActions />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <NextAppointments appointments={mockAppointments} />
                        <FinancialSummary
                            income={mockFinancialData.income}
                            expenses={mockFinancialData.expenses}
                            unpaidSessions={mockFinancialData.unpaidSessions}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
