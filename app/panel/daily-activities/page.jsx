// features/daily-activities/pages/DailyActivitiesPage.jsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
	useCreateActivity,
	useGetActivities,
	useUpdateActivity,
	useSubmitFeedback
} from '@/features/daily-activities/queries/useDailyActivity'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ActivityForm } from '@/features/daily-activities/components/ActivityForm'
import { ActivityList } from '@/features/daily-activities/components/ActivityList'

const DailyActivitiesPage = () => {
	const { data: session } = useSession()
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState(null)
	const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
	const [feedback, setFeedback] = useState('')
	const [selectedActivityId, setSelectedActivityId] = useState(null)
	const [feedbackType, setFeedbackType] = useState('') // Yeni state
	const [filterStatus, setFilterStatus] = useState('all')

	const isAdmin = session?.user?.role === 'ADMIN'

	const { data: activitiesData, isLoading } = useGetActivities({
		status: filterStatus !== 'all' ? filterStatus : undefined
	})

	const createActivity = useCreateActivity()
	const updateActivity = useUpdateActivity()
	const submitFeedback = useSubmitFeedback()

	const handleCreateOrUpdate = async (values) => {
		try {
			if (selectedActivity) {
				await updateActivity.mutateAsync({
					id: selectedActivity.id,
					data: values
				})
			} else {
				await createActivity.mutateAsync(values)
			}
			setIsFormOpen(false)
			setSelectedActivity(null)
		} catch (error) {
			console.error('Error saving activity:', error)
		}
	}

	const handleEdit = (activity) => {
		setSelectedActivity(activity)
		setIsFormOpen(true)
	}

	const handleApprove = async (activityId) => {
		setSelectedActivityId(activityId)
		setFeedbackType('APPROVED') // Feedback tipini ayarla
		setFeedback('')
		setFeedbackDialogOpen(true)
	}

	const handleReject = async (activityId) => {
		setSelectedActivityId(activityId)
		setFeedbackType('REJECTED') // Feedback tipini ayarla
		setFeedback('')
		setFeedbackDialogOpen(true)
	}

	const handleFeedbackSubmit = async () => {
		try {
			await submitFeedback.mutateAsync({
				id: selectedActivityId,
				data: {
					status: feedbackType, // feedbackDialogOpen yerine feedbackType kullan
					feedback
				}
			})
			setFeedbackDialogOpen(false)
			setFeedbackType('') // Reset feedback type
			setFeedback('') // Reset feedback
		} catch (error) {
			console.error('Error submitting feedback:', error)
		}
	}

	return (
		<div className="max-w-5xl w-full mx-auto p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">
					{isAdmin ? 'Öğrenci Aktiviteleri' : 'Staj Günlüğü'}
				</h1>
				<div className="flex items-center gap-4">
					<Select
						value={filterStatus}
						onValueChange={setFilterStatus}
					>
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
					{!isAdmin && (
						<Button onClick={() => setIsFormOpen(true)}>
							Yeni Aktivite
						</Button>
					)}
				</div>
			</div>

			<ActivityList
				activities={activitiesData?.data || []}
				onEdit={handleEdit}
				isAdmin={isAdmin}
				onApprove={handleApprove}
				onReject={handleReject}
			/>

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							{selectedActivity
								? 'Aktivite Düzenle'
								: 'Yeni Aktivite'}
						</DialogTitle>
					</DialogHeader>
					<ActivityForm
						defaultValues={selectedActivity}
						onSubmit={handleCreateOrUpdate}
						isSubmitting={
							createActivity.isLoading || updateActivity.isLoading
						}
					/>
				</DialogContent>
			</Dialog>

			<Dialog
				open={feedbackDialogOpen}
				onOpenChange={setFeedbackDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{feedbackType === 'APPROVED'
								? 'Aktivite Onaylama'
								: 'Aktivite Reddetme'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Textarea
							placeholder="Geri bildiriminizi yazın..."
							value={feedback}
							onChange={(e) => setFeedback(e.target.value)}
						/>
						<div className="flex justify-end">
							<Button onClick={handleFeedbackSubmit}>
								{feedbackType === 'APPROVED' ? 'Onayla' : 'Reddet'}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default DailyActivitiesPage
