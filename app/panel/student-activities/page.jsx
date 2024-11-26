// app/panel/student-activities/page.jsx
'use client'
import { useState } from 'react'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
	useStudentActivities,
	useStudents,
	useSubmitFeedback
} from '@/features/student-activities/queries/useStudentQueries'
import { StudentList } from '@/features/student-activities/components/StudentList'
import { StudentActivities } from '@/features/student-activities/components/StudentActivities'
import { ActivityDetailModal } from '@/features/student-activities/components/ActivityDetailModal'

export default function StudentActivitiesPage() {
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [detailsOpen, setDetailsOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState(null)
	const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
	const [feedback, setFeedback] = useState('')
	const [selectedActivityId, setSelectedActivityId] = useState(null)
	const [feedbackType, setFeedbackType] = useState('')

	// Pagination and filter states
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [status, setStatus] = useState('all')
	const [search, setSearch] = useState('')

	const { data: students } = useStudents()
	const { data: activitiesData } = useStudentActivities(
		selectedStudent?.id,
		{ page, limit, status, search }
	)
	const submitFeedback = useSubmitFeedback()

	const handleStudentSelect = (student) => {
		setSelectedStudent(student)
		setPage(1)
	}

	const handleBack = () => {
		setSelectedStudent(null)
		setPage(1)
		setStatus('all')
		setSearch('')
	}

	const handleViewDetails = (activity) => {
		setSelectedActivity(activity)
		setDetailsOpen(true)
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

	if (!selectedStudent) {
		return (
			<StudentList
				students={students}
				onStudentSelect={handleStudentSelect}
			/>
		)
	}

	return (
		<>
			<StudentActivities
				student={selectedStudent}
				activities={activitiesData?.data || []}
				pagination={
					activitiesData?.pagination || {
						page: 1,
						limit: 10,
						total: 0,
						pageCount: 1
					}
				}
				onBack={handleBack}
				onViewDetails={handleViewDetails}
				onApprove={handleApprove}
				onReject={handleReject}
				onPageChange={setPage}
				onLimitChange={(newLimit) => {
					setLimit(Number(newLimit))
					setPage(1)
				}}
				onStatusFilter={(newStatus) => {
					setStatus(newStatus)
					setPage(1)
				}}
				onSearch={(newSearch) => {
					setSearch(newSearch)
					setPage(1)
				}}
			/>

			<ActivityDetailModal
				activity={selectedActivity}
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
			/>

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
		</>
	)
}
