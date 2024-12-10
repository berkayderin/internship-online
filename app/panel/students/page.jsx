'use client'

import { useRouter } from 'next/navigation'
import { StudentList } from '@/features/student-activities/components/StudentList'
import { useStudents } from '@/features/student-activities/queries/useStudentQueries'

export default function StudentsPage() {
	const router = useRouter()
	const { data: students } = useStudents()

	const handleStudentSelect = (studentId) => {
		router.push(`/panel/student-activities?studentId=${studentId}`)
	}

	return (
		<div className="space-y-6">
			<StudentList
				students={students || []}
				onStudentSelect={handleStudentSelect}
			/>
		</div>
	)
}
