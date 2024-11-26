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
	BookOpenCheck
} from 'lucide-react'
import { useSession } from 'next-auth/react'

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
	const commonMenus = [
		{
			title: 'Staj Defteri',
			url: '/internship-diary',
			icon: BookOpen,
			items: [
				{
					title: 'Tüm Aktiviteler',
					url: '/panel/daily-activities'
				}
			]
		}
	]

	if (role === 'ADMIN') {
		commonMenus[0].items.push({
			title: 'Öğrenci Aktiviteleri',
			url: '/panel/student-activities'
		})
	}

	const adminMenus = [
		{
			title: 'Raporlar',
			url: '/reports',
			icon: BarChart,
			items: [
				{
					title: 'Staj İstatistikleri',
					url: '/statistics'
				},
				{
					title: 'Değerlendirmeler',
					url: '/evaluations'
				}
			]
		}
	]

	const userMenus = [
		{
			title: 'Staj Bilgileri',
			url: '/internship-info',
			icon: ClipboardList,
			items: [
				{
					title: 'Staj Durumu',
					url: '/status'
				},
				{
					title: 'Belgelerim',
					url: '/documents'
				}
			]
		},
		{
			title: 'Kurum',
			url: '/company',
			icon: Building,
			items: [
				{
					title: 'Kurum Bilgileri',
					url: '/info'
				},
				{
					title: 'Değerlendirme',
					url: '/evaluation'
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

	console.log('session:', session)

	const userData = {
		firstName: session?.user?.firstName,
		lastName: session?.user?.lastName,
		email: session?.user?.email,
		avatar: '/avatars/default.jpg'
	}

	const teams = [
		{
			name: 'Staj Defteri',
			logo: BookOpenCheck,
			plan: role === 'admin' ? 'Yönetici' : 'Öğrenci'
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
