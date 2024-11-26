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
	ChevronsRight
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

export function StudentActivities({
	student,
	activities,
	pagination,
	onBack,
	onViewDetails,
	onApprove,
	onReject,
	onPageChange,
	onLimitChange,
	onStatusFilter,
	onSearch
}) {
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search)
		}, 500)

		return () => clearTimeout(timer)
	}, [search])

	useEffect(() => {
		onSearch(debouncedSearch)
	}, [debouncedSearch, onSearch])

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" onClick={onBack}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Geri
				</Button>
				<h1 className="text-2xl font-bold">
					{student.firstName} {student.lastName} - Staj Aktiviteleri
				</h1>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input
						placeholder="Ara..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-64"
					/>
					<Select onValueChange={onStatusFilter} defaultValue="all">
						<SelectTrigger className="w-[180px]">
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
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Tarih</TableHead>
							<TableHead>Öğrenci</TableHead>
							<TableHead>İçerik</TableHead>
							<TableHead>Durum</TableHead>
							<TableHead>Geri Bildirim</TableHead>
							<TableHead>Detay</TableHead>
							<TableHead>İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{activities?.map((activity) => (
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
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					Toplam {pagination.total} kayıttan{' '}
					{(pagination.page - 1) * pagination.limit + 1}-
					{Math.min(
						pagination.page * pagination.limit,
						pagination.total
					)}{' '}
					arası gösteriliyor
				</div>

				<div className="flex items-center gap-2">
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
	)
}
