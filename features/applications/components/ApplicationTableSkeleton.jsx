import { TableCell, TableRow } from '@/components/ui/table'

export function ApplicationTableSkeleton({ isAdmin }) {
	return (
		<>
			{[...Array(5)].map((_, index) => (
				<TableRow key={index}>
					{isAdmin && (
						<TableCell>
							<div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
						</TableCell>
					)}
					<TableCell>
						<div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
					</TableCell>
					<TableCell>
						<div className="space-y-2">
							<div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
							<div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
						</div>
					</TableCell>
					<TableCell>
						<div className="space-y-2">
							<div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
							<div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
						</div>
					</TableCell>
					<TableCell>
						<div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
					</TableCell>
					<TableCell>
						<div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
					</TableCell>
					{isAdmin && (
						<TableCell>
							<div className="flex gap-2">
								<div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
								<div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
							</div>
						</TableCell>
					)}
				</TableRow>
			))}
		</>
	)
}
