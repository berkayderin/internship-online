// app/panel/student-activities/page.jsx
'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StudentActivities } from '@/features/student-activities/components/StudentActivities'
import { ActivityDetailModal } from '@/features/student-activities/components/ActivityDetailModal'
import {
	useStudentActivities,
	useSubmitFeedback
} from '@/features/student-activities/queries/useStudentQueries'

export default function StudentActivitiesPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const studentId = searchParams.get('studentId')

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [status, setStatus] = useState('all')
	const [search, setSearch] = useState('')
	const [detailsOpen, setDetailsOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState(null)

	const {
		data: activitiesData,
		isLoading,
		error
	} = useStudentActivities(studentId, {
		page,
		limit,
		status,
		search
	})

	const submitFeedback = useSubmitFeedback()

	console.log('Query params:', {
		studentId,
		page,
		limit,
		status,
		search
	})
	console.log('Activities data:', activitiesData)
	console.log('Loading:', isLoading)
	console.log('Error:', error)

	const handleBack = () => {
		router.push('/panel/students')
	}

	const handleViewDetails = (activity) => {
		setSelectedActivity(activity)
		setDetailsOpen(true)
	}

	const handleStatusFilter = (status) => {
		setStatus(status)
		setPage(1)
	}

	const handleSearch = (value) => {
		setSearch(value)
		setPage(1)
	}

	const handleApprove = async (activityId) => {
		try {
			await submitFeedback.mutateAsync({
				id: activityId,
				data: {
					status: 'APPROVED',
					feedback: ''
				}
			})
		} catch (error) {
			console.error('Error approving activity:', error)
		}
	}

	const handleReject = async (activityId, feedback) => {
		try {
			await submitFeedback.mutateAsync({
				id: activityId,
				data: {
					status: 'REJECTED',
					feedback: feedback
				}
			})
		} catch (error) {
			console.error('Error rejecting activity:', error)
		}
	}

	if (isLoading) {
		return <div>Yükleniyor...</div>
	}

	if (error) {
		return <div>Hata: {error.message}</div>
	}

	return (
		<div className="space-y-6">
			<StudentActivities
				student={activitiesData?.student}
				activities={activitiesData?.data || []}
				pagination={activitiesData?.pagination}
				onBack={handleBack}
				onViewDetails={handleViewDetails}
				onPageChange={setPage}
				onLimitChange={(value) => setLimit(parseInt(value))}
				onStatusFilter={handleStatusFilter}
				onSearch={handleSearch}
				onApprove={handleApprove}
				onReject={handleReject}
			/>

			<ActivityDetailModal
				activity={selectedActivity}
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
				onApprove={handleApprove}
				onReject={handleReject}
			/>
		</div>
	)
}
