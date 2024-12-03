// app/panel/page.jsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreatePeriodDialog } from '@/features/internship-periods/components/CreatePeriodDialog'
import { ApplicationDialog } from '@/features/applications/components/ApplicationDialog'
import { useInternshipPeriods } from '@/features/internship-periods/queries/useInternshipPeriod'
import { useApplications } from '@/features/applications/queries/useApplication'
import { PlusIcon } from 'lucide-react'

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

export default function PanelPage() {
	const { data: session } = useSession()
	const [createPeriodOpen, setCreatePeriodOpen] = useState(false)
	const [applicationOpen, setApplicationOpen] = useState(false)
	const [selectedPeriodId, setSelectedPeriodId] = useState(null)

	const { data: periods } = useInternshipPeriods()
	const { data: applications } = useApplications()

	const isAdmin = session?.user?.role === 'ADMIN'
	const activePeriod = periods?.find((period) => {
		const now = new Date()
		return (
			now >= new Date(period.startDate) &&
			now <= new Date(period.endDate)
		)
	})

	const currentApplication = applications?.find(
		(app) => app.periodId === activePeriod?.id
	)

	const handleApplyClick = (periodId) => {
		setSelectedPeriodId(periodId)
		setApplicationOpen(true)
	}

	return (
		<div className="max-w-4xl">
			<div className="flex items-center justify-between pb-4">
				<h1 className="text-3xl font-bold text-gray-800">
					Hoş Geldiniz, {session?.user?.firstName}
				</h1>
				{isAdmin && (
					<Button onClick={() => setCreatePeriodOpen(true)}>
						<span className="flex items-center gap-2">
							<PlusIcon className="w-4 h-4" />
							Yeni Staj Dönemi Oluştur
						</span>
					</Button>
				)}
			</div>

			{!isAdmin && activePeriod && (
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
					<h2 className="text-2xl font-semibold mb-4 text-gray-800 ">
						Aktif Staj Dönemi
					</h2>

					<div className="space-y-4">
						<div className="flex flex-col gap-2">
							<span className="text-gray-600 dark:text-gray-400">
								Dönem Adı:
							</span>
							<p className="text-lg font-medium">
								{activePeriod.name}
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-gray-600 dark:text-gray-400">
								Tarih Aralığı:
							</span>
							<p className="text-lg font-medium">
								{new Date(activePeriod.startDate).toLocaleDateString(
									'tr-TR'
								)}{' '}
								-
								{new Date(activePeriod.endDate).toLocaleDateString(
									'tr-TR'
								)}
							</p>
						</div>

						{currentApplication ? (
							<div className="mt-6 space-y-4">
								<div className="flex items-center gap-3">
									<span className="font-medium text-gray-700 dark:text-gray-300">
										Başvuru Durumu:
									</span>
									<Badge
										variant={
											statusVariants[currentApplication.status]
										}
									>
										{statusText[currentApplication.status]}
									</Badge>
								</div>

								{currentApplication.feedback && (
									<div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 ">
										<p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
											Geri Bildirim:
										</p>
										<p className="text-gray-600 dark:text-gray-400 italic">
											"{currentApplication.feedback}"
										</p>
									</div>
								)}
							</div>
						) : (
							<Button
								onClick={() => handleApplyClick(activePeriod.id)}
								className="w-full mt-4"
							>
								Staja Başvur
							</Button>
						)}
					</div>
				</div>
			)}

			<CreatePeriodDialog
				open={createPeriodOpen}
				onOpenChange={setCreatePeriodOpen}
				periodId={selectedPeriodId}
			/>

			<ApplicationDialog
				open={applicationOpen}
				onOpenChange={setApplicationOpen}
				periodId={selectedPeriodId}
			/>
		</div>
	)
}
