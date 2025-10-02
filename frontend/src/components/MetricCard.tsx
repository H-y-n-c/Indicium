import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  format?: 'percentage' | 'number';
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({
  title,
  value,
  description,
  format = 'percentage',
  trend = 'neutral',
}: MetricCardProps) {
  const formattedValue =
    format === 'percentage' ? `${value.toFixed(2)}%` : value.toLocaleString('pt-BR');

  const trendColor =
    trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500';

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{formattedValue}</div>
          {TrendIcon && <TrendIcon className={`h-5 w-5 ${trendColor}`} />}
        </div>
        <CardDescription className="mt-2 text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
