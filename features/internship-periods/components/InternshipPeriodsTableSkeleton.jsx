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

export default function InternshipPeriodsTableSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Staj Dönemleri</h1>
				<Skeleton className="h-10 w-[137px]" />
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Dönem Adı</TableHead>
							<TableHead>Başvuru Başlangıç</TableHead>
							<TableHead>Başvuru Bitiş</TableHead>
							<TableHead>Staj Başlangıç</TableHead>
							<TableHead>Staj Bitiş</TableHead>
							<TableHead className="text-right">İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, index) => (
							<TableRow key={index}>
								<TableCell className="font-medium">
									<Skeleton className="h-5 w-[200px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-[150px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-[150px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-[150px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-[150px]" />
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end space-x-2">
										<Skeleton className="h-9 w-9 rounded-md" />
										<Skeleton className="h-9 w-9 rounded-md" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
