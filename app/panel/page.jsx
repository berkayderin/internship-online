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
		<div className="space-y-6 w-full">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Hoş Geldiniz</h1>
				{isAdmin && (
					<Button onClick={() => setCreatePeriodOpen(true)}>
						Yeni Staj Dönemi Oluştur
					</Button>
				)}
			</div>

			{!isAdmin && activePeriod && (
				<div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg shadow-sm">
					<h2 className="text-xl font-semibold mb-4">
						Aktif Staj Dönemi
					</h2>
					<p className="mb-4">{activePeriod.name}</p>
					{currentApplication ? (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<span className="font-medium">Başvuru Durumu:</span>
								<Badge
									variant={statusVariants[currentApplication.status]}
								>
									{statusText[currentApplication.status]}
								</Badge>
							</div>
							{currentApplication.feedback && (
								<div className="bg-white dark:bg-gray-800 p-4 rounded-md">
									<p className="font-medium mb-1">Geri Bildirim:</p>
									<p className="text-gray-600 dark:text-gray-300 italic">
										"{currentApplication.feedback}"
									</p>
								</div>
							)}
						</div>
					) : (
						<Button onClick={() => handleApplyClick(activePeriod.id)}>
							Staja Başvur
						</Button>
					)}
				</div>
			)}

			<CreatePeriodDialog
				open={createPeriodOpen}
				onOpenChange={setCreatePeriodOpen}
			/>

			<ApplicationDialog
				open={applicationOpen}
				onOpenChange={setApplicationOpen}
				periodId={selectedPeriodId}
			/>
		</div>
	)
}
