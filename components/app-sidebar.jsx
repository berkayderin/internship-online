'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  BookOpen,
  BookOpenCheck,
  Building,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  UserCircle,
  Users,
} from 'lucide-react';

export function AppSidebar({ ...props }) {
  const { data: session } = useSession();
  const role = session?.user?.role || 'USER';
  const pathname = usePathname();

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch('/api/applications').then((res) => res.json()),
  });

  const hasApprovedApplication = Array.isArray(applications) ? applications.some((app) => app.status === 'APPROVED') : false;

  const getMenusByRole = (role, pathname, hasApprovedApplication) => {
    const commonMenus = [
      {
        title: 'Panel',
        url: '/panel',
        icon: LayoutDashboard,
        isActive: pathname === '/panel' || pathname.startsWith('/panel/'),
        items: [
          {
            title: 'Genel Bakış',
            url: '/panel',
            icon: LayoutDashboard,
            isActive: pathname === '/panel',
          },
        ],
      },
    ];

    const userMenus = [
      {
        title: 'Staj İşlemleri',
        icon: BookOpen,
        isActive: pathname.startsWith('/panel/applications') || pathname.startsWith('/panel/daily-activities'),
        items: [
          {
            title: 'Başvurularım',
            url: '/panel/applications',
            icon: ClipboardList,
            isActive: pathname.startsWith('/panel/applications'),
          },
          ...(hasApprovedApplication
            ? [
                {
                  title: 'Günlük Aktiviteler',
                  url: '/panel/daily-activities',
                  icon: CalendarDays,
                  isActive: pathname.startsWith('/panel/daily-activities'),
                },
              ]
            : []),
        ],
      },
    ];

    const adminMenus = [
      {
        title: 'Staj Yönetimi',
        icon: BookOpen,
        isActive: pathname.startsWith('/panel/internship-periods') || pathname.startsWith('/panel/applications'),
        items: [
          {
            title: 'Staj Dönemleri',
            url: '/panel/internship-periods',
            icon: CalendarDays,
            isActive: pathname.startsWith('/panel/internship-periods'),
          },
          {
            title: 'Başvurular',
            url: '/panel/applications',
            icon: ClipboardList,
            isActive: pathname.startsWith('/panel/applications'),
          },
          {
            title: 'Resmi Tatiller',
            url: '/panel/public-holidays',
            icon: CalendarDays,
            isActive: pathname.startsWith('/panel/public-holidays'),
          },
        ],
      },
      {
        title: 'Öğrenci İşlemleri',
        icon: Users,
        isActive: pathname.startsWith('/panel/students') || pathname.startsWith('/panel/student-activities'),
        items: [
          {
            title: 'Öğrenci Listesi',
            url: '/panel/students',
            icon: UserCircle,
            isActive: pathname.startsWith('/panel/students'),
          },
          {
            title: 'Öğrenci Aktiviteleri',
            url: '/panel/student-activities',
            icon: FileText,
            isActive: pathname.startsWith('/panel/student-activities'),
          },
        ],
      },
      {
        title: 'Sistem Yönetimi',
        icon: Settings,
        isActive: pathname.startsWith('/panel/admins'),
        items: [
          {
            title: 'Yönetici Listesi',
            url: '/panel/admins',
            icon: Users,
            isActive: pathname.startsWith('/panel/admins'),
          },
        ],
      },
    ];

    return role === 'ADMIN' ? [...commonMenus, ...adminMenus] : [...commonMenus, ...userMenus];
  };

  const userData = {
    firstName: session?.user?.firstName,
    lastName: session?.user?.lastName,
    email: session?.user?.email,
    avatar: '/avatars/default.jpg',
  };

  const teams = [
    {
      logo: BookOpenCheck,
      role: session?.user?.role === 'ADMIN' ? 'Yönetici' : 'Öğrenci',
      title: 'Staj Defteri',
    },
  ];

  const menuItems = getMenusByRole(role, pathname, hasApprovedApplication);

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
  );
}
