export function NoDataDisplay({ icon: Icon, message }) {
	return (
		<div className="h-[300px] flex items-center justify-center">
			<div className="text-center">
				<Icon
					className="w-12 h-12 mb-4 text-muted-foreground/40 mx-auto"
					strokeWidth={1.5}
				/>
				<p className="text-sm text-muted-foreground">{message}</p>
			</div>
		</div>
	)
}
