// app/panel/student-activities/page.jsx
'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
	useStudentActivities,
	useStudents
} from '@/features/student-activities/queries/useStudentQueries'
import { StudentList } from '@/features/student-activities/components/StudentList'
import { StudentActivities } from '@/features/student-activities/components/StudentActivities'
import { ActivityDetailModal } from '@/features/student-activities/components/ActivityDetailModal'

export default function StudentActivitiesPage() {
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [detailsOpen, setDetailsOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState(null)

	const { data: students } = useStudents()
	const { data: activitiesData } = useStudentActivities(
		selectedStudent?.id
	)

	const handleStudentSelect = (student) => {
		setSelectedStudent(student)
	}

	const handleBack = () => {
		setSelectedStudent(null)
	}

	const handleViewDetails = (activity) => {
		setSelectedActivity(activity)
		setDetailsOpen(true)
	}

	const handleApprove = (activityId) => {
		// TODO: Implement approval logic
		console.log('Approve activity:', activityId)
	}

	const handleReject = (activityId) => {
		// TODO: Implement rejection logic
		console.log('Reject activity:', activityId)
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
				onBack={handleBack}
				onViewDetails={handleViewDetails}
				onApprove={handleApprove}
				onReject={handleReject}
			/>

			<ActivityDetailModal
				activity={selectedActivity}
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
			/>
		</>
	)
}
