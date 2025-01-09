import {
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip
} from 'recharts'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { ClipboardList } from 'lucide-react'
import { NoDataDisplay } from './NoDataDisplay'
import { ChartSkeleton } from './ChartSkeleton'
import { useApplicationStats } from '../queries/useStats'
import { applicationChartConfig } from '../utils/chartConfig'

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-lg border bg-background p-2 shadow-sm">
				<div className="flex items-center gap-2">
					<div
						className="h-2 w-2 rounded-full"
						style={{ backgroundColor: payload[0].payload.color }}
					/>
					<span className="font-medium">
						{payload[0].name}: {payload[0].value}
					</span>
				</div>
			</div>
		)
	}
	return null
}

export function ApplicationStats() {
	const { data: stats, isLoading } = useApplicationStats()

	if (isLoading) {
		return <ChartSkeleton title="Başvuru İstatistikleri" />
	}

	const chartData = Object.entries(stats).map(([status, count]) => ({
		name: applicationChartConfig[status].label,
		value: count,
		color: applicationChartConfig[status].color
	}))

	const hasData = chartData.some((item) => item.value > 0)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Başvuru İstatistikleri</CardTitle>
			</CardHeader>
			<CardContent>
				{hasData ? (
					<div className="h-[300px]">
						<ChartContainer config={applicationChartConfig}>
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={80}
										paddingAngle={2}
										dataKey="value"
									>
										{chartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
											/>
										))}
									</Pie>
									<Tooltip content={<CustomTooltip />} />
								</PieChart>
							</ResponsiveContainer>
						</ChartContainer>
						<div className="mt-4 flex justify-center gap-4">
							{chartData.map((entry, index) => (
								<div key={index} className="flex items-center gap-2">
									<div
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: entry.color }}
									/>
									<span className="text-sm text-muted-foreground">
										{entry.name} ({entry.value})
									</span>
								</div>
							))}
						</div>
					</div>
				) : (
					<NoDataDisplay
						icon={ClipboardList}
						message="Henüz başvuru bulunmamaktadır"
					/>
				)}
			</CardContent>
		</Card>
	)
}
