// app/panel/layout.jsx

import { SessionProvider } from 'next-auth/react'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from '@/components/ui/sidebar'

export default function PanelLayout({ children }) {
	return (
		<SessionProvider>
			<SidebarProvider>
				<div className="flex min-h-screen w-full">
					<AppSidebar className="shrink-0" />
					<SidebarInset className="w-full">
						<header className="flex h-16 w-full shrink-0 items-center gap-2 border-b">
							<div className="flex w-full items-center gap-2 px-4">
								<SidebarTrigger className="-ml-1" />
							</div>
						</header>
						<main className="flex-1 w-full p-6">{children}</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</SessionProvider>
	)
}
