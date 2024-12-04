'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
	Building,
	Calendar,
	Users2,
	CheckCircle,
	XCircle,
	Info
} from 'lucide-react'
import {
	useApplications,
	useUpdateApplication,
	useBulkUpdateApplications
} from '@/features/applications/queries/useApplication'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'

const statusText = {
	PENDING: 'Beklemede',
	APPROVED: 'Onaylandı',
	REJECTED: 'Reddedildi'
}

const statusVariants = {
	PENDING: 'warning',
	APPROVED: 'success',
	REJECTED: 'destructive'
}

export default function ApplicationsPage() {
	const session = useSession()
	const isAdmin = session?.data?.user?.role === 'ADMIN'
	const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
	const [selectedApplication, setSelectedApplication] = useState(null)
	const [feedback, setFeedback] = useState('')
	const [actionType, setActionType] = useState(null)
	const [selectedIds, setSelectedIds] = useState([])

	const { data: applications, isLoading } = useApplications()
	const updateApplication = useUpdateApplication()
	const bulkUpdateApplications = useBulkUpdateApplications()

	const canManageApplication = (application) => {
		return application.userId !== session?.user?.id
	}

	const manageableApplications =
		applications?.filter(canManageApplication) || []

	const handleAction = (application, type) => {
		if (!canManageApplication(application)) {
			toast({
				title: 'Hata',
				description: 'Kendi başvurunuzu onaylayamazsınız',
				variant: 'destructive'
			})
			return
		}

		setSelectedApplication(application)
		setActionType(type)
		setFeedbackDialogOpen(true)
	}

	const handleSubmitFeedback = async () => {
		try {
			await updateApplication.mutateAsync({
				id: selectedApplication.id,
				data: {
					status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
					feedback
				}
			})
			setFeedbackDialogOpen(false)
			setFeedback('')
			setSelectedApplication(null)
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const handleBulkAction = (type) => {
		setActionType(type)
		setFeedbackDialogOpen(true)
	}

	const handleBulkSubmit = async () => {
		try {
			await bulkUpdateApplications.mutateAsync({
				ids: selectedIds,
				data: {
					status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
					feedback
				}
			})
			setFeedbackDialogOpen(false)
			setFeedback('')
			setSelectedIds([])
		} catch (error) {
			console.error('Error:', error)
		}
	}

	if (isLoading) return <div>Yükleniyor...</div>

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Staj Başvuruları</h1>
				{isAdmin && selectedIds.length > 0 && (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							className="text-green-600 hover:text-green-700"
							onClick={() => handleBulkAction('approve')}
						>
							<CheckCircle className="h-4 w-4 mr-1" />
							Seçilenleri Onayla
						</Button>
						<Button
							size="sm"
							variant="outline"
							className="text-red-600 hover:text-red-700"
							onClick={() => handleBulkAction('reject')}
						>
							<XCircle className="h-4 w-4 mr-1" />
							Seçilenleri Reddet
						</Button>
					</div>
				)}
			</div>

			<Table className="border w-[1400px]">
				<TableHeader>
					<TableRow>
						{isAdmin && (
							<TableHead className="w-12">
								<Checkbox
									checked={
										selectedIds.length ===
										manageableApplications.filter(
											(a) => a.status === 'PENDING'
										).length
									}
									onCheckedChange={(checked) => {
										if (checked) {
											setSelectedIds(
												manageableApplications
													.filter((a) => a.status === 'PENDING')
													.map((a) => a.id)
											)
										} else {
											setSelectedIds([])
										}
									}}
								/>
							</TableHead>
						)}
						<TableHead>Öğrenci</TableHead>
						<TableHead>Şirket Bilgileri</TableHead>
						<TableHead>Staj Dönemi</TableHead>
						<TableHead>Başvuru Tarihi</TableHead>
						<TableHead>Durum</TableHead>
						{isAdmin && <TableHead>İşlemler</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{(isAdmin ? manageableApplications : applications)
						.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={isAdmin ? 7 : 5}
								className="h-24 text-center text-muted-foreground"
							>
								Henüz hiç başvuru bulunmuyor.
							</TableCell>
						</TableRow>
					) : (
						(isAdmin ? manageableApplications : applications).map(
							(application) => (
								<TableRow key={application.id}>
									{isAdmin && (
										<TableCell>
											{application.status === 'PENDING' && (
												<Checkbox
													checked={selectedIds.includes(
														application.id
													)}
													onCheckedChange={(checked) => {
														if (checked) {
															setSelectedIds([
																...selectedIds,
																application.id
															])
														} else {
															setSelectedIds(
																selectedIds.filter(
																	(id) => id !== application.id
																)
															)
														}
													}}
												/>
											)}
										</TableCell>
									)}
									<TableCell>
										{application.user?.firstName}{' '}
										{application.user?.lastName}
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="font-medium flex items-center gap-1">
												<Building className="h-4 w-4" />
												{application.companyName}
											</div>
											<div className="text-sm text-muted-foreground flex items-center gap-1">
												<Users2 className="h-4 w-4" />
												{application.companyEmployeeCount} Çalışan (
												{application.companyEngineerCount} Mühendis)
											</div>
											{application.companyWebsite && (
												<div className="text-sm text-blue-600">
													<a
														href={application.companyWebsite}
														target="_blank"
														rel="noopener noreferrer"
														className="hover:underline"
													>
														Website
													</a>
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="font-medium">
												{application.period.name}
											</div>
											<div className="text-sm text-muted-foreground flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												{format(
													new Date(application.period.startDate),
													'd MMM',
													{ locale: tr }
												)}{' '}
												-{' '}
												{format(
													new Date(application.period.endDate),
													'd MMM yyyy',
													{ locale: tr }
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>
										{format(
											new Date(application.createdAt),
											'd MMMM yyyy',
											{
												locale: tr
											}
										)}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Badge
												variant={statusVariants[application.status]}
											>
												{statusText[application.status]}
											</Badge>
											{application.status === 'REJECTED' &&
												application.feedback && (
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger>
																<Info className="h-4 w-4 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="max-w-xs">
																	{application.feedback}
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
										</div>
									</TableCell>
									{isAdmin && (
										<TableCell>
											<div className="flex gap-2">
												{application.status === 'PENDING' && (
													<>
														<Button
															size="sm"
															variant="outline"
															className="text-green-600 hover:text-green-700"
															onClick={() =>
																handleAction(application, 'approve')
															}
														>
															<CheckCircle className="h-4 w-4 mr-1" />
															Onayla
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="text-red-600 hover:text-red-700"
															onClick={() =>
																handleAction(application, 'reject')
															}
														>
															<XCircle className="h-4 w-4 mr-1" />
															Reddet
														</Button>
													</>
												)}
											</div>
										</TableCell>
									)}
								</TableRow>
							)
						)
					)}
				</TableBody>
			</Table>

			{isAdmin && (
				<Dialog
					open={feedbackDialogOpen}
					onOpenChange={setFeedbackDialogOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{selectedIds.length > 1 ? 'Toplu ' : ''}
								{actionType === 'approve'
									? 'Başvuru Onaylama'
									: 'Başvuru Reddetme'}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<Textarea
								placeholder="Geri bildiriminizi yazın..."
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
							/>
							<div className="flex justify-end">
								<Button
									onClick={
										selectedIds.length > 1
											? handleBulkSubmit
											: handleSubmitFeedback
									}
								>
									{actionType === 'approve' ? 'Onayla' : 'Reddet'}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	)
}
