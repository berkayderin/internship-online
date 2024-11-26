// features/student-activities/components/StudentActivities.jsx
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Eye, ChevronDown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
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
	onBack,
	onViewDetails,
	onApprove,
	onReject
}) {
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
		</div>
	)
}
