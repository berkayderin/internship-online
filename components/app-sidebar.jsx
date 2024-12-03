'use client'

import * as React from 'react'
import {
	BookOpen,
	ClipboardList,
	FileText,
	Users,
	Settings,
	BarChart,
	CalendarDays,
	UserCircle,
	Building,
	CheckSquare,
	BookOpenCheck,
	LayoutDashboard
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail
} from '@/components/ui/sidebar'

const getMenusByRole = (role) => {
	const pathname = usePathname()

	const commonMenus = [
		{
			title: 'Panel',
			url: '/panel',
			icon: LayoutDashboard,
			isActive:
				pathname === '/panel' || pathname.startsWith('/panel/'),
			items: [
				{
					title: 'Genel Bakış',
					url: '/panel',
					icon: LayoutDashboard,
					isActive: pathname === '/panel'
				}
			]
		}
	]

	// Kullanıcının onaylı başvurusu varsa Staj Günlüğü menüsünü ekle
	const { data: applications } = useQuery({
		queryKey: ['applications'],
		queryFn: () =>
			fetch('/api/applications').then((res) => res.json())
	})

	const hasApprovedApplication = applications?.some(
		(app) => app.status === 'APPROVED'
	)

	const userMenus = [
		{
			title: 'Staj İşlemleri',
			icon: BookOpen,
			isActive:
				pathname.startsWith('/panel/applications') ||
				pathname.startsWith('/panel/daily-activities'),
			items: [
				{
					title: 'Başvurularım',
					url: '/panel/applications',
					icon: ClipboardList,
					isActive: pathname.startsWith('/panel/applications')
				},
				...(hasApprovedApplication
					? [
							{
								title: 'Günlük Aktiviteler',
								url: '/panel/daily-activities',
								icon: CalendarDays,
								isActive: pathname.startsWith(
									'/panel/daily-activities'
								)
							}
					  ]
					: [])
			]
		}
	]

	const adminMenus = [
		{
			title: 'Staj Yönetimi',
			icon: BookOpen,
			isActive:
				pathname.startsWith('/panel/internship-periods') ||
				pathname.startsWith('/panel/applications'),
			items: [
				{
					title: 'Staj Dönemleri',
					url: '/panel/internship-periods',
					icon: CalendarDays,
					isActive: pathname.startsWith('/panel/internship-periods')
				},
				{
					title: 'Başvurular',
					url: '/panel/applications',
					icon: ClipboardList,
					isActive: pathname.startsWith('/panel/applications')
				}
			]
		},
		{
			title: 'Öğrenci İşlemleri',
			icon: Users,
			isActive:
				pathname.startsWith('/panel/students') ||
				pathname.startsWith('/panel/student-activities'),
			items: [
				{
					title: 'Öğrenci Listesi',
					url: '/panel/students',
					icon: UserCircle,
					isActive: pathname.startsWith('/panel/students')
				},
				{
					title: 'Öğrenci Aktiviteleri',
					url: '/panel/student-activities',
					icon: FileText,
					isActive: pathname.startsWith('/panel/student-activities')
				}
			]
		},
		{
			title: 'Ayarlar',
			icon: Settings,
			isActive: pathname.startsWith('/panel/settings'),
			items: [
				{
					title: 'Sistem Ayarları',
					url: '/panel/settings',
					icon: Settings,
					isActive: pathname.startsWith('/panel/settings')
				}
			]
		}
	]

	return role === 'ADMIN'
		? [...commonMenus, ...adminMenus]
		: [...commonMenus, ...userMenus]
}

export function AppSidebar({ ...props }) {
	const { data: session } = useSession()
	const role = session?.user?.role || 'USER'

	const userData = {
		firstName: session?.user?.firstName,
		lastName: session?.user?.lastName,
		email: session?.user?.email,
		avatar: '/avatars/default.jpg'
	}

	const teams = [
		{
			logo: BookOpenCheck,
			role: role === 'ADMIN' ? 'Yönetici' : 'Öğrenci'
		}
	]

	const menuItems = getMenusByRole(role)

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={menuItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
