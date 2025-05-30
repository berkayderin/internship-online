import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ClipboardList } from 'lucide-react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartSkeleton } from './ChartSkeleton';
import { NoDataDisplay } from './NoDataDisplay';

import { useApplicationStats } from '../queries/useStats';
import { applicationChartConfig } from '../utils/chartConfig';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
          <span className="font-medium">{payload[0].value} başvuru</span>
        </div>
      </div>
    );
  }
  return null;
};

export function ApplicationStats() {
  const { data: stats, isLoading } = useApplicationStats();

  if (isLoading) {
    return <ChartSkeleton title="Başvuru İstatistikleri" />;
  }

  const chartData = Object.entries(stats).map(([status, count]) => ({
    name: applicationChartConfig[status].label,
    value: count,
    color: applicationChartConfig[status].color,
  }));

  const hasData = chartData.some((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Başvuru İstatistikleri</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-6">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                  <span className="font-medium" style={{ color: entry.color }}>
                    ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <NoDataDisplay icon={ClipboardList} message="Henüz başvuru bulunmamaktadır" />
        )}
      </CardContent>
    </Card>
  );
}
