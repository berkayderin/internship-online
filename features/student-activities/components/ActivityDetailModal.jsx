// features/student-activities/components/ActivityDetailModal.jsx
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import {
	CalendarIcon,
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
	BookOpenIcon,
	UserIcon,
	BuildingIcon
} from 'lucide-react'

export const statusText = {
	PENDING: 'Değerlendiriliyor',
	APPROVED: 'Onaylandı',
	REJECTED: 'Reddedildi'
}

export const statusVariants = {
	PENDING: 'warning',
	APPROVED: 'success',
	REJECTED: 'destructive'
}

export function ActivityDetailModal({
	activity,
	open,
	onOpenChange
}) {
	if (!activity) return null

	const statusIcons = {
		PENDING: <ClockIcon className="h-4 w-4" />,
		APPROVED: <CheckCircleIcon className="h-4 w-4" />,
		REJECTED: <XCircleIcon className="h-4 w-4" />
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
				<DialogHeader>
					<DialogTitle>Aktivite Detayı</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[70vh] pr-4">
					<div className="space-y-6">
						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
							<CardContent className="pt-6 flex items-center justify-between">
								<div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
									<CalendarIcon className="h-5 w-5" />
									{format(new Date(activity.date), 'd MMMM yyyy', {
										locale: tr
									})}
								</div>
								<Badge
									variant={statusVariants[activity.status]}
									className="flex items-center gap-1 text-sm px-3 py-1"
								>
									{statusIcons[activity.status]}
									{statusText[activity.status]}
								</Badge>
							</CardContent>
						</Card>

						<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
							<CardContent className="pt-6">
								<h3 className="font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
									<BookOpenIcon className="h-5 w-5" />
									Aktivite İçeriği
								</h3>
								<div
									className="prose max-w-none dark:prose-invert"
									dangerouslySetInnerHTML={{
										__html: activity.content
									}}
								/>
							</CardContent>
						</Card>

						{activity.feedback && (
							<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
								<CardContent className="pt-6">
									<h3 className="font-semibold text-lg mb-3 text-indigo-700 dark:text-indigo-300">
										Geri Bildirim
									</h3>
									<p className="text-gray-700 dark:text-gray-300 italic">
										"{activity.feedback}"
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
