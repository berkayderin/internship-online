'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar'

export function TeamSwitcher({ teams }) {
	const { data: session } = useSession()
	const { isMobile } = useSidebar()
	const [activeTeam, setActiveTeam] = React.useState(teams[0])

	React.useEffect(() => {
		if (session?.user?.role) {
			setActiveTeam({
				...teams[0],
				role: session.user.role === 'ADMIN' ? 'Yönetici' : 'Öğrenci'
			})
		}
	}, [session?.user?.role, teams])

	const Logo = activeTeam.logo

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<Logo className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{activeTeam.title}
						</span>
						<span className="truncate text-xs text-muted-foreground">
							{activeTeam.role}
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
