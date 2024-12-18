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
import { CountdownTimer } from '@/components/main/CountdownTimer'

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

	const handleApplyClick = (periodId) => {
		setSelectedPeriodId(periodId)
		setApplicationOpen(true)
	}

	return (
		<div className="max-w-4xl">
			<div className="flex flex-col justify-start items-start gap-4">
				<h1 className="text-2xl font-semibold ">
					Hoş Geldiniz, {session?.user?.firstName}{' '}
					{session?.user?.lastName}
				</h1>
				{isAdmin && (
					<Button onClick={() => setCreatePeriodOpen(true)} size="sm">
						<span className="flex items-center gap-2">
							<PlusIcon className="w-4 h-4" />
							Yeni Staj Dönemi Oluştur
						</span>
					</Button>
				)}
			</div>

			{!isAdmin && periods?.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					{periods.map((period) => (
						<div
							key={period.id}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200"
						>
							<div className="space-y-4">
								<div className="flex flex-col gap-2">
									<span className="text-gray-600 dark:text-gray-400">
										Dönem Adı:
									</span>
									<p className="text-lg font-medium">{period.name}</p>
								</div>

								<div className="flex flex-col gap-2">
									<span className="text-gray-600 dark:text-gray-400">
										Başvuru Tarihleri:
									</span>
									<p className="text-lg font-medium">
										{new Date(period.startDate).toLocaleDateString(
											'tr-TR'
										)}{' '}
										-{' '}
										{new Date(period.endDate).toLocaleDateString(
											'tr-TR'
										)}
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<span className="text-gray-600 dark:text-gray-400">
										Staj Tarihleri:
									</span>
									<p className="text-lg font-medium">
										{new Date(
											period.internshipStartDate
										).toLocaleDateString('tr-TR')}{' '}
										-{' '}
										{new Date(
											period.internshipEndDate
										).toLocaleDateString('tr-TR')}
									</p>
								</div>

								{new Date() < new Date(period.startDate) ? (
									<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
										<CountdownTimer
											targetDate={new Date(period.startDate)}
										/>
										<Button className="w-full mt-4" disabled>
											Başvurular Henüz Başlamadı
										</Button>
									</div>
								) : new Date() > new Date(period.endDate) ? (
									<div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
										<p className="text-red-600 dark:text-red-400 text-center">
											Başvuru dönemi sona erdi
										</p>
										<Button className="w-full mt-4" disabled>
											Başvurular Kapandı
										</Button>
									</div>
								) : (
									<div>
										{applications?.find(
											(app) => app.periodId === period.id
										) ? (
											<div className="mt-6 space-y-4">
												<div className="flex items-center gap-3">
													<span className="font-medium text-gray-700 dark:text-gray-300">
														Başvuru Durumu:
													</span>
													<Badge
														variant={
															statusVariants[
																applications.find(
																	(app) => app.periodId === period.id
																).status
															]
														}
													>
														{
															statusText[
																applications.find(
																	(app) => app.periodId === period.id
																).status
															]
														}
													</Badge>
												</div>

												{applications.find(
													(app) => app.periodId === period.id
												).feedback && (
													<div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200">
														<p className="font-medium dark:text-gray-200 mb-2">
															Geri Bildirim:
														</p>
														<p className="text-gray-600 dark:text-gray-400 italic">
															{
																applications.find(
																	(app) => app.periodId === period.id
																).feedback
															}
														</p>
													</div>
												)}
											</div>
										) : (
											<Button
												onClick={() => handleApplyClick(period.id)}
												className="w-full mt-4"
											>
												Staja Başvur
											</Button>
										)}
									</div>
								)}
							</div>
						</div>
					))}
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
