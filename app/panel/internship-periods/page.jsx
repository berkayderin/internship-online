// app/panel/internship-periods/page.jsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { PeriodDialog } from '@/features/internship-periods/components/PeriodDialog'
import {
	useInternshipPeriods,
	useDeleteInternshipPeriod
} from '@/features/internship-periods/queries/useInternshipPeriod'
import InternshipPeriodsTableSkeleton from '@/features/internship-periods/components/InternshipPeriodsTableSkeleton'

export default function InternshipPeriodsPage() {
	const [createDialogOpen, setCreateDialogOpen] = useState(false)
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedPeriod, setSelectedPeriod] = useState(null)

	const { data: periods, isLoading } = useInternshipPeriods()
	const deletePeriod = useDeleteInternshipPeriod()

	const handleEdit = (period) => {
		const formattedPeriod = {
			...period,
			startDate: new Date(period.startDate),
			endDate: new Date(period.endDate),
			internshipStartDate: new Date(period.internshipStartDate),
			internshipEndDate: new Date(period.internshipEndDate)
		}
		setSelectedPeriod(formattedPeriod)
		setEditDialogOpen(true)
	}

	const handleDelete = (period) => {
		setSelectedPeriod(period)
		setDeleteDialogOpen(true)
	}

	const confirmDelete = async () => {
		await deletePeriod.mutateAsync(selectedPeriod.id)
		setDeleteDialogOpen(false)
		setSelectedPeriod(null)
	}

	if (isLoading) {
		return <InternshipPeriodsTableSkeleton />
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Staj Dönemleri</h1>
				<Button onClick={() => setCreateDialogOpen(true)}>
					Yeni Dönem Ekle
				</Button>
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
						{!periods?.length ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center text-muted-foreground"
								>
									Henüz hiç staj dönemi bulunmuyor.
								</TableCell>
							</TableRow>
						) : (
							periods?.map((period) => (
								<TableRow key={period.id}>
									<TableCell>{period.name}</TableCell>
									<TableCell>
										{format(
											new Date(period.startDate),
											'd MMMM yyyy',
											{
												locale: tr
											}
										)}
									</TableCell>
									<TableCell>
										{format(new Date(period.endDate), 'd MMMM yyyy', {
											locale: tr
										})}
									</TableCell>
									<TableCell>
										{format(
											new Date(period.internshipStartDate),
											'd MMMM yyyy',
											{
												locale: tr
											}
										)}
									</TableCell>
									<TableCell>
										{format(
											new Date(period.internshipEndDate),
											'd MMMM yyyy',
											{
												locale: tr
											}
										)}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(period)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(period)}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<PeriodDialog
				open={createDialogOpen || editDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setCreateDialogOpen(false)
						setEditDialogOpen(false)
						setSelectedPeriod(null)
					}
				}}
				period={selectedPeriod}
			/>

			<Dialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Emin misiniz?</DialogTitle>
						<DialogDescription>
							Bu işlem geri alınamaz. Bu staj dönemini silmek
							istediğinizden emin misiniz?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							İptal
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDelete}
							disabled={deletePeriod.isLoading}
						>
							{deletePeriod.isLoading ? 'Siliniyor...' : 'Sil'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
