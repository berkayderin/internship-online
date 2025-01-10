import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

import { Users } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { ChartSkeleton } from './ChartSkeleton';
import { NoDataDisplay } from './NoDataDisplay';

import { useStudentStats } from '../queries/useStats';
import { departmentColors, studentChartConfig } from '../utils/chartConfig';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3" />
            <span className="font-medium">{payload[0].name}</span>
          </div>
          <span className="pl-4 text-sm text-muted-foreground">{payload[0].value} öğrenci</span>
        </div>
      </div>
    );
  }
  return null;
};

export function StudentStats() {
  const { data: stats, isLoading } = useStudentStats();

  if (isLoading) {
    return <ChartSkeleton title="Bölümlere Göre Öğrenci Dağılımı" />;
  }

  const chartData = Object.entries(stats.departments).map(([department, count]) => ({
    name: department,
    value: count,
    color: departmentColors[department],
    fill: departmentColors[department],
  }));

  chartData.sort((a, b) => b.value - a.value);

  const hasData = chartData.some((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold">Toplam Öğrenci Sayısı</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bölümlere Göre Öğrenci Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="flex flex-col items-center">
              <div className="h-[300px] w-full max-w-[500px]">
                <ChartContainer config={studentChartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" outerRadius={120} innerRadius={60} dataKey="value" labelLine={false}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-8 flex justify-center gap-8">
                {chartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-4 w-4" style={{ backgroundColor: entry.fill }} />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <NoDataDisplay icon={Users} message="Henüz öğrenci kaydı bulunmamaktadır" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
