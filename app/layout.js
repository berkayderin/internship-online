import localFont from 'next/font/local'
import './globals.css'
import QueryProvider from '@/provider/QueryProvider'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata = {
	title: 'Staj Defterim',
	description: ''
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	)
}
