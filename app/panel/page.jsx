// app/panel/page.jsx
import { auth } from '@/auth'
import { SignOutButton } from '@/components/main/SignOutButton'
import Link from 'next/link'

const PanelPage = async () => {
	const session = await auth()

	console.log(session)

	return (
		<div>
			<h1>Hoş geldin</h1>

			{session?.user ? (
				<>
					<div>{JSON.stringify(session, null, 2)}</div>
					<SignOutButton />
				</>
			) : (
				<Link href="/login">Giriş yapın</Link>
			)}
		</div>
	)
}

export default PanelPage
