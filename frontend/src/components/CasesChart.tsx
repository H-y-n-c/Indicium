'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CaseData } from '@/lib/api';

interface CasesChartProps {
  data: CaseData[];
  groupBy: string;
}

export function CasesChart({ data, groupBy }: CasesChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: formatDate(item.date, groupBy),
      casos: item.count,
    }));
  }, [data, groupBy]);

  function formatDate(dateStr: string, groupBy: string): string {
    if (groupBy === 'daily') {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}`;
    } else if (groupBy === 'monthly') {
      const [year, month] = dateStr.split('-');
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      return `${monthNames[parseInt(month) - 1]}/${year}`;
    }
    return dateStr; // yearly
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Casos SRAG</CardTitle>
        <CardDescription>
          Número de casos ao longo do tempo (agrupamento:{' '}
          {groupBy === 'daily' ? 'diário' : groupBy === 'monthly' ? 'mensal' : 'anual'})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="casos"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Casos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
