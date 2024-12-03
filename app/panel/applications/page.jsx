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
	XCircle
} from 'lucide-react'
import {
	useApplications,
	useUpdateApplication
} from '@/features/applications/queries/useApplication'

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
	const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
	const [selectedApplication, setSelectedApplication] = useState(null)
	const [feedback, setFeedback] = useState('')
	const [actionType, setActionType] = useState(null)

	const { data: applications, isLoading } = useApplications()
	const updateApplication = useUpdateApplication()

	const handleAction = (application, type) => {
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

	if (isLoading) return <div>Yükleniyor...</div>

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Staj Başvuruları</h1>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Öğrenci</TableHead>
							<TableHead>Şirket Bilgileri</TableHead>
							<TableHead>Staj Dönemi</TableHead>
							<TableHead>Başvuru Tarihi</TableHead>
							<TableHead>Durum</TableHead>
							<TableHead>İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{applications?.map((application) => (
							<TableRow key={application.id}>
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
									<Badge variant={statusVariants[application.status]}>
										{statusText[application.status]}
									</Badge>
								</TableCell>
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
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={feedbackDialogOpen}
				onOpenChange={setFeedbackDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
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
							<Button onClick={handleSubmitFeedback}>
								{actionType === 'approve' ? 'Onayla' : 'Reddet'}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
