'use client';

export default function StatsCards({
    totalPatients,
    appointmentsToday,
    monthRevenue,
    activeSessions
}: {
    totalPatients: number;
    appointmentsToday: number;
    monthRevenue: number;
    activeSessions: number;
}) {
    const stats = [
        {
            label: 'Pacientes ativos',
            value: totalPatients,
        },
        {
            label: 'Sessões hoje',
            value: appointmentsToday,
        },
        {
            label: 'Receita mensal',
            value: `R$ ${monthRevenue.toLocaleString('pt-BR')}`,
        },
        {
            label: 'Programas ativos',
            value: activeSessions,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="stat-card"
                >
                    <p className="text-xs text-muted mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
