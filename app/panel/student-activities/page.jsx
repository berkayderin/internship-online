// app/panel/student-activities/page.jsx
'use client'
import { Suspense } from 'react'
import { StudentActivitiesContent } from '@/features/student-activities/components/StudentActivitiesContent'

const StudentActivitiesPage = () => {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[200px]">
					<div className="text-center text-muted-foreground">
						Sayfa yükleniyor...
					</div>
				</div>
			}
		>
			<StudentActivitiesContent />
		</Suspense>
	)
}

export default StudentActivitiesPage
