// app/panel/layout.jsx

import { SessionProvider } from 'next-auth/react'
import { AppSidebar } from '@/components/app-sidebar'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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
								<Separator
									orientation="vertical"
									className="mr-2 h-4"
								/>
								<Breadcrumb className="w-full">
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbLink href="/panel">
												Panel
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbPage>Genel Bakış</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
						</header>
						<main className="flex p-6">{children}</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</SessionProvider>
	)
}
