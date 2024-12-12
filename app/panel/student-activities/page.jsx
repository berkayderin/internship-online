// app/panel/student-activities/page.jsx
'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StudentActivities } from '@/features/student-activities/components/StudentActivities'
import { ActivityDetailModal } from '@/features/student-activities/components/ActivityDetailModal'
import {
	useStudentActivities,
	useSubmitFeedback
} from '@/features/student-activities/queries/useStudentQueries'
import {
	generateActivityReport,
	generateSummaryReport
} from '@/features/student-activities/services/pdf'
import { summarizeActivities } from '@/features/student-activities/services/ai'
import { toast } from '@/hooks/use-toast'

const StudentActivitiesPage = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const studentId = searchParams.get('studentId')

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [status, setStatus] = useState('all')
	const [search, setSearch] = useState('')
	const [detailsOpen, setDetailsOpen] = useState(false)
	const [selectedActivity, setSelectedActivity] = useState(null)
	const [isSummarizing, setIsSummarizing] = useState(false)

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

	const handleGenerateReport = async () => {
		if (!activitiesData?.student || !activitiesData?.data) return

		try {
			const pdfDoc = generateActivityReport(
				activitiesData.student,
				activitiesData.data
			)

			pdfDoc.download(
				`${activitiesData.student.firstName}_${activitiesData.student.lastName}_staj_raporu.pdf`
			)
		} catch (error) {
			console.error('PDF oluşturma hatası:', error)
		}
	}

	const handleGenerateSummary = async () => {
		try {
			if (!activitiesData?.student || !activitiesData?.data) {
				toast({
					variant: 'destructive',
					title: 'Hata',
					description: 'Öğrenci veya aktivite verisi bulunamadı'
				})
				return
			}

			setIsSummarizing(true)
			const summary = await summarizeActivities(activitiesData.data)
			const pdfDoc = generateSummaryReport(
				activitiesData.student,
				summary
			)
			pdfDoc.download(
				`${activitiesData.student.firstName}_${activitiesData.student.lastName}_staj_özeti.pdf`
			)
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Hata',
				description: 'Özet raporu oluşturulurken bir hata oluştu'
			})
			console.error(error)
		} finally {
			setIsSummarizing(false)
		}
	}

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
			{error ? (
				<div className="text-center text-red-500 bg-red-50 rounded-md">
					Hata: {error.message}
				</div>
			) : (
				<div>
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
						onGenerateReport={handleGenerateReport}
						onGenerateSummary={handleGenerateSummary}
						isLoading={isLoading}
						isSummarizing={isSummarizing}
					/>

					<ActivityDetailModal
						activity={selectedActivity}
						open={detailsOpen}
						onOpenChange={setDetailsOpen}
						onApprove={handleApprove}
						onReject={handleReject}
					/>
				</div>
			)}
		</Suspense>
	)
}

export default StudentActivitiesPage
