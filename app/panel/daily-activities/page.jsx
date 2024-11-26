// app/panel/daily-activities/page.jsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
	useCreateActivity,
	useGetActivities,
	useUpdateActivity,
	useSubmitFeedback
} from '@/features/daily-activities/queries/useDailyActivity'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ActivityForm } from '@/features/daily-activities/components/ActivityForm'
import { DailyActivitiesTable } from '@/features/daily-activities/components/DailyActivitiesTable'

const DailyActivitiesPage = () => {
	const { data: session } = useSession()
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState(null)
	const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
	const [feedback, setFeedback] = useState('')
	const [selectedActivityId, setSelectedActivityId] = useState(null)
	const [feedbackType, setFeedbackType] = useState('')

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [filterStatus, setFilterStatus] = useState('all')

	const isAdmin = session?.user?.role === 'ADMIN'

	const { data: activitiesData, isLoading } = useGetActivities({
		page,
		limit,
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

	const handleOpenNewForm = () => {
		setSelectedActivity(null)
		setIsFormOpen(true)
	}

	const handleApprove = (activityId) => {
		setSelectedActivityId(activityId)
		setFeedbackType('APPROVED')
		setFeedback('')
		setFeedbackDialogOpen(true)
	}

	const handleReject = (activityId) => {
		setSelectedActivityId(activityId)
		setFeedbackType('REJECTED')
		setFeedback('')
		setFeedbackDialogOpen(true)
	}

	const handleFeedbackSubmit = async () => {
		try {
			await submitFeedback.mutateAsync({
				id: selectedActivityId,
				data: {
					status: feedbackType,
					feedback
				}
			})
			setFeedbackDialogOpen(false)
			setFeedbackType('')
			setFeedback('')
		} catch (error) {
			console.error('Error submitting feedback:', error)
		}
	}

	const handleModalClose = () => {
		setIsFormOpen(false)
		setSelectedActivity(null)
	}

	return (
		<div className="max-w-7xl w-full space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">
					{isAdmin ? 'Tüm Aktiviteler' : 'Staj Günlüğü'}
				</h1>
				{!isAdmin && (
					<Button onClick={handleOpenNewForm}>Ekle</Button>
				)}
			</div>

			<DailyActivitiesTable
				data={activitiesData?.data || []}
				pagination={
					activitiesData?.pagination || {
						page: 1,
						limit: 10,
						total: 0,
						pageCount: 1
					}
				}
				onPageChange={setPage}
				onLimitChange={(newLimit) => {
					setLimit(Number(newLimit))
					setPage(1)
				}}
				onStatusFilter={setFilterStatus}
				onApprove={handleApprove}
				onReject={handleReject}
				onEdit={handleEdit}
				isAdmin={isAdmin}
			/>

			<Dialog open={isFormOpen} onOpenChange={handleModalClose}>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>
							{selectedActivity
								? 'Staj Günlüğü Düzenle'
								: 'Staj Günlüğü Ekle'}
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
