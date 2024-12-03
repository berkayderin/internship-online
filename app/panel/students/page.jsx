'use client'

import { useRouter } from 'next/navigation'
import { StudentList } from '@/features/student-activities/components/StudentList'
import { useStudents } from '@/features/student-activities/queries/useStudentQueries'

export default function StudentsPage() {
	const router = useRouter()
	const { data: students, isLoading } = useStudents()

	const handleStudentSelect = (studentId) => {
		router.push(`/panel/student-activities?studentId=${studentId}`)
	}

	if (isLoading) {
		return <div>Yükleniyor...</div>
	}

	return (
		<div className="max-w-7xl w-full space-y-6">
			<StudentList
				students={students || []}
				onStudentSelect={handleStudentSelect}
			/>
		</div>
	)
}
