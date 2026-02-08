'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface GoalData {
    name: string;
    percentage: number;
    target: number;
}

interface GoalsChartProps {
    data: GoalData[];
    height?: number;
}

const COLORS = ['#8b52d1', '#38a3f8', '#34c759', '#ff9f0a', '#ff3b30'];

export function GoalsChart({ data, height = 300 }: GoalsChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-gray-50 rounded-xl"
                style={{ height }}
            >
                <p className="text-muted">Nenhuma meta cadastrada</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" horizontal={false} />
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: '#8e8e93' }}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12, fill: '#636366' }}
                        width={90}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'white',
                            border: '1px solid #e8e8ed',
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value, name) => [
                            `${(value as number).toFixed(1)}%`,
                            name === 'percentage' ? 'Atual' : 'Meta'
                        ]}
                    />
                    <Bar
                        dataKey="percentage"
                        radius={[0, 6, 6, 0]}
                        barSize={24}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.percentage >= entry.target ? '#34c759' : COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
