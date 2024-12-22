'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

export function PublicHolidayListSkeleton() {
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
						{[...Array(4)].map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<div className="flex items-center gap-2">
										<Skeleton className="h-5 w-[150px]" />
										<Skeleton className="h-5 w-[80px]" />
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-[120px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-[120px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-9 w-9 rounded-md" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
