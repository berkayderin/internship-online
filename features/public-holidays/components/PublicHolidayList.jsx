'use client'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { usePublicHolidays } from '../queries/usePublicHoliday'
import { PublicHolidayDialog } from './PublicHolidayDialog'
import { getPublicHolidayName } from '../utils/publicHolidayUtils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Edit } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export function PublicHolidayList() {
	const { data: holidays, isLoading } = usePublicHolidays()
	const [selectedHoliday, setSelectedHoliday] = useState(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	if (isLoading) return <div>Yükleniyor...</div>

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Resmi Tatiller</h2>
			</div>

			<div className="border rounded-md overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tatil Adı</TableHead>
							<TableHead>Başlangıç Tarihi</TableHead>
							<TableHead>Bitiş Tarihi</TableHead>
							<TableHead>İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{holidays.map((holiday) => (
							<TableRow key={holiday.id}>
								<TableCell>
									<div className="flex items-center gap-2">
										{getPublicHolidayName(holiday.type)}
										<Badge variant="outline">
											{differenceInDays(
												new Date(holiday.endDate),
												new Date(holiday.startDate)
											) + 1}{' '}
											Gün Tatil
										</Badge>
									</div>
								</TableCell>
								<TableCell>
									{format(
										new Date(holiday.startDate),
										'dd MMMM yyyy',
										{
											locale: tr
										}
									)}
								</TableCell>
								<TableCell>
									{format(new Date(holiday.endDate), 'dd MMMM yyyy', {
										locale: tr
									})}
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											setSelectedHoliday(holiday)
											setIsDialogOpen(true)
										}}
									>
										<Edit className="w-4 h-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{selectedHoliday && (
				<PublicHolidayDialog
					mode="edit"
					holiday={selectedHoliday}
					open={isDialogOpen}
					onOpenChange={setIsDialogOpen}
				/>
			)}
		</div>
	)
}
