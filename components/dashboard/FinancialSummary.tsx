'use client';

interface FinancialSummaryProps {
    income: number;
    expenses: number;
    unpaidSessions: number;
}

export default function FinancialSummary({ income, expenses, unpaidSessions }: FinancialSummaryProps) {
    const net = income - expenses;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="card">
            <h3 className="text-sm font-medium text-foreground mb-4">
                Resumo financeiro - {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted">Receitas</span>
                    <span className="text-sm font-medium text-success">{formatCurrency(income)}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted">Despesas</span>
                    <span className="text-sm font-medium text-error">{formatCurrency(expenses)}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-foreground">Líquido</span>
                    <span className="text-base font-semibold text-foreground">{formatCurrency(net)}</span>
                </div>
            </div>

            {unpaidSessions > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted">
                        {unpaidSessions} {unpaidSessions === 1 ? 'sessão pendente' : 'sessões pendentes'} de cobrança
                    </p>
                </div>
            )}

            <button className="btn btn-primary w-full mt-4 text-sm">
                Ver relatório completo
            </button>
        </div>
    );
}
