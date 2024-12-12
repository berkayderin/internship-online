// features/student-activities/components/StudentActivities.jsx
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
	Eye,
	ChevronDown,
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	FileDown,
	FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { statusText, statusVariants } from './ActivityDetailModal'
import { StudentActivitiesSkeleton } from './StudentActivitiesSkeleton'

const defaultPagination = {
	page: 1,
	limit: 10,
	total: 0,
	pageCount: 1
}

const StudentActivities = ({
	student,
	activities = [],
	pagination = defaultPagination,
	onBack,
	onViewDetails,
	onApprove,
	onReject,
	onPageChange,
	onLimitChange,
	onStatusFilter,
	onSearch,
	onGenerateReport,
	onGenerateSummary,
	isLoading,
	isSummarizing
}) => {
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')

	console.log('student', student)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search)
		}, 500)

		return () => clearTimeout(timer)
	}, [search])

	useEffect(() => {
		onSearch(debouncedSearch)
	}, [debouncedSearch, onSearch])

	if (isLoading) {
		return <StudentActivitiesSkeleton />
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="flex items-center gap-4">
					{student && (
						<Button variant="ghost" onClick={onBack}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Geri
						</Button>
					)}
					<h1 className="text-2xl font-bold">
						{student
							? `${student.firstName} ${student.lastName} - Staj Aktiviteleri`
							: 'Tüm Öğrenci Aktiviteleri'}
					</h1>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
					<Input
						placeholder="Ara..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full sm:w-64"
					/>
					<Select onValueChange={onStatusFilter} defaultValue="all">
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Duruma göre filtrele" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tümü</SelectItem>
							<SelectItem value="PENDING">Bekleyenler</SelectItem>
							<SelectItem value="APPROVED">Onaylananlar</SelectItem>
							<SelectItem value="REJECTED">Reddedilenler</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{student && (
					<div className="flex flex-col sm:flex-row gap-2 ml-auto">
						<Button
							className="w-full sm:w-auto"
							onClick={onGenerateReport}
							disabled={isLoading}
						>
							<FileDown className="w-4 h-4 mr-2" />
							Rapor Oluştur
						</Button>
						<Button
							className="w-full sm:w-auto"
							onClick={onGenerateSummary}
							disabled={isLoading || isSummarizing}
						>
							<FileText className="w-4 h-4 mr-2" />
							{isSummarizing ? 'Özetleniyor...' : 'Özetle'}
						</Button>
					</div>
				)}
			</div>

			<div className="rounded-md border">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="w-[150px]">Tarih</TableHead>
							<TableHead className="w-[200px]">Öğrenci</TableHead>
							<TableHead>İçerik</TableHead>
							<TableHead className="w-[120px]">Durum</TableHead>
							<TableHead className="w-[200px]">
								Geri Bildirim
							</TableHead>
							<TableHead className="w-[80px]">Detay</TableHead>
							<TableHead className="w-[80px]">İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!activities?.length ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="h-24 text-center text-muted-foreground"
								>
									Henüz hiç aktivite bulunmuyor.
								</TableCell>
							</TableRow>
						) : (
							activities?.map((activity) => (
								<TableRow key={activity.id}>
									<TableCell className="whitespace-nowrap">
										{format(new Date(activity.date), 'd MMMM yyyy', {
											locale: tr
										})}
									</TableCell>
									<TableCell>
										{activity.user.firstName} {activity.user.lastName}
										<div className="text-sm text-muted-foreground">
											{activity.user.department}
										</div>
									</TableCell>
									<TableCell className="max-w-md truncate">
										{activity.content
											.replace(/<[^>]*>/g, '')
											.substring(0, 100)}
										...
									</TableCell>
									<TableCell>
										<Badge variant={statusVariants[activity.status]}>
											{statusText[activity.status]}
										</Badge>
									</TableCell>
									<TableCell>
										{activity.feedback || (
											<span className="text-muted-foreground">-</span>
										)}
									</TableCell>
									<TableCell>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onViewDetails(activity)}
										>
											<Eye className="w-4 h-4" />
										</Button>
									</TableCell>
									<TableCell>
										{activity.status === 'PENDING' && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<ChevronDown className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => onApprove(activity.id)}
													>
														Onayla
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onReject(activity.id)}
													>
														Reddet
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="w-full bg-white">
				<div className="flex flex-col sm:flex-row items-center gap-4">
					<div className="text-sm text-muted-foreground">
						Toplam {pagination.total} kayıttan{' '}
						{(pagination.page - 1) * pagination.limit + 1}-
						{Math.min(
							pagination.page * pagination.limit,
							pagination.total
						)}{' '}
						arası gösteriliyor
					</div>

					<div className="flex flex-col sm:flex-row items-center gap-2 sm:ml-auto">
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange(1)}
								disabled={pagination.page === 1}
							>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange(pagination.page - 1)}
								disabled={pagination.page === 1}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange(pagination.page + 1)}
								disabled={pagination.page === pagination.pageCount}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange(pagination.pageCount)}
								disabled={pagination.page === pagination.pageCount}
							>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
						<Select onValueChange={onLimitChange} defaultValue="10">
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Sayfa başına" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5 kayıt</SelectItem>
								<SelectItem value="10">10 kayıt</SelectItem>
								<SelectItem value="20">20 kayıt</SelectItem>
								<SelectItem value="50">50 kayıt</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	)
}

export { StudentActivities }
