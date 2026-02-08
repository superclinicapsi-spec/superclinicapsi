'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface DataPoint {
    date: string;
    [key: string]: string | number;
}

interface ProgressChartProps {
    data: DataPoint[];
    lines?: {
        key: string;
        name: string;
        color: string;
    }[];
    height?: number;
}

export function ProgressChart({
    data,
    lines = [{ key: 'percentage', name: 'Progresso (%)', color: '#8b52d1' }],
    height = 300,
}: ProgressChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-gray-50 rounded-xl"
                style={{ height }}
            >
                <p className="text-muted">Sem dados para exibir</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ed" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#8e8e93' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e8e8ed' }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#8e8e93' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e8e8ed' }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'white',
                            border: '1px solid #e8e8ed',
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value) => [`${(value as number).toFixed(1)}%`, '']}
                    />
                    <Legend />
                    {lines.map((line) => (
                        <Line
                            key={line.key}
                            type="monotone"
                            dataKey={line.key}
                            name={line.name}
                            stroke={line.color}
                            strokeWidth={2}
                            dot={{ r: 4, fill: line.color }}
                            activeDot={{ r: 6, fill: line.color }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
