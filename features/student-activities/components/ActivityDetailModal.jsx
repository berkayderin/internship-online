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

export const statusText = {
	PENDING: 'Bekliyor',
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Aktivite Detayı</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<h3 className="font-medium">Tarih</h3>
						<p>
							{format(new Date(activity.date), 'd MMMM yyyy', {
								locale: tr
							})}
						</p>
					</div>
					<div>
						<h3 className="font-medium">İçerik</h3>
						<div
							className="prose max-w-none"
							dangerouslySetInnerHTML={{ __html: activity.content }}
						/>
					</div>
					<div>
						<h3 className="font-medium">Durum</h3>
						<Badge variant={statusVariants[activity.status]}>
							{statusText[activity.status]}
						</Badge>
					</div>
					{activity.feedback && (
						<div>
							<h3 className="font-medium">Geri Bildirim</h3>
							<p>{activity.feedback}</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
