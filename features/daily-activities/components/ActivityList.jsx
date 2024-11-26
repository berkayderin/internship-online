import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusColors = {
	PENDING: 'bg-yellow-500',
	APPROVED: 'bg-green-500',
	REJECTED: 'bg-red-500'
}

const statusText = {
	PENDING: 'Bekliyor',
	APPROVED: 'Onaylandı',
	REJECTED: 'Reddedildi'
}

export function ActivityList({
	activities,
	onEdit,
	isAdmin,
	onApprove,
	onReject
}) {
	const handleContentLength = (content) => {
		return content.length > 300
			? `${content.slice(0, 300)}...`
			: content
	}

	return (
		<div className="space-y-4">
			{activities.map((activity) => (
				<Card key={activity.id}>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg">
								{format(
									new Date(activity.date),
									'd MMMM yyyy, EEEE',
									{ locale: tr }
								)}
							</CardTitle>
							<Badge className={statusColors[activity.status]}>
								{statusText[activity.status]}
							</Badge>
						</div>
						{isAdmin && (
							<CardDescription>
								{activity.user.firstName} {activity.user.lastName} -{' '}
								{activity.user.department}
							</CardDescription>
						)}
					</CardHeader>
					<CardContent>
						<div
							dangerouslySetInnerHTML={{
								__html: handleContentLength(activity.content)
							}}
						/>
						{activity.feedback && (
							<div className="mt-4 p-4 bg-muted rounded-md">
								<p className="font-semibold">
									Öğretmen Geri Bildirimi:
								</p>
								<p>{activity.feedback}</p>
							</div>
						)}
					</CardContent>
					<CardFooter className="flex justify-end space-x-2">
						{isAdmin
							? activity.status === 'PENDING' && (
									<>
										<Button
											variant="destructive"
											onClick={() => onReject(activity.id)}
										>
											Reddet
										</Button>
										<Button
											variant="default"
											onClick={() => onApprove(activity.id)}
										>
											Onayla
										</Button>
									</>
							  )
							: activity.status === 'PENDING' && (
									<Button onClick={() => onEdit(activity)}>
										Düzenle
									</Button>
							  )}
					</CardFooter>
				</Card>
			))}
		</div>
	)
}
