// app/panel/page.jsx

import { auth } from '@/auth'

export default async function PanelPage() {
	const session = await auth()

	return (
		<div className="space-y-6 w-full">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Hoş Geldiniz</h1>
			</div>

			{session?.user && (
				<div className="bg-gray-100 p-4 rounded-md">
					<pre className="whitespace-pre-wrap">
						{JSON.stringify(session, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
