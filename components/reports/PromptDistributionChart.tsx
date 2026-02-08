'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

interface PromptData {
    name: string;
    value: number;
}

interface PromptDistributionChartProps {
    data: PromptData[];
    height?: number;
}

const COLORS = {
    'Independente': '#34c759',
    'Gestual': '#38a3f8',
    'Verbal': '#8b52d1',
    'Parcial': '#ff9f0a',
    'Total': '#ff3b30',
};

const DEFAULT_COLORS = ['#8b52d1', '#38a3f8', '#34c759', '#ff9f0a', '#ff3b30'];

export function PromptDistributionChart({ data, height = 300 }: PromptDistributionChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-gray-50 rounded-xl"
                style={{ height }}
            >
                <p className="text-muted">Sem dados de prompts</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#8e8e93' }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name as keyof typeof COLORS] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: 'white',
                            border: '1px solid #e8e8ed',
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value) => [`${value} registros`, '']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
