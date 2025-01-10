'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AdminDialog } from './AdminDialog'
import { AdminDeleteDialog } from './AdminDeleteDialog'
import { useAdmins } from '../queries/useAdmin'

export function AdminList() {
	const { data: session } = useSession()
	const [selectedAdmin, setSelectedAdmin] = useState(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const { data: admins = [], isLoading } = useAdmins()

	const handleEdit = (admin) => {
		setSelectedAdmin(admin)
		setIsDialogOpen(true)
	}

	const handleAdd = () => {
		setSelectedAdmin(null)
		setIsDialogOpen(true)
	}

	const handleClose = () => {
		setSelectedAdmin(null)
		setIsDialogOpen(false)
	}

	const handleDelete = (admin) => {
		setSelectedAdmin(admin)
		setIsDeleteDialogOpen(true)
	}

	const handleDeleteClose = () => {
		setSelectedAdmin(null)
		setIsDeleteDialogOpen(false)
	}

	const formatDate = (dateString) => {
		if (!dateString) return '-'
		return new Date(dateString).toLocaleDateString('tr-TR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	if (isLoading) {
		return <div>Yükleniyor...</div>
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button onClick={handleAdd} variant="default">
					Yönetici Ekle
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Ad Soyad</TableHead>
							<TableHead>E-posta</TableHead>
							<TableHead>Bölüm</TableHead>
							<TableHead>Oluşturulma Tarihi</TableHead>
							<TableHead className="text-right">İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{admins.map((admin) => (
							<TableRow key={admin.id}>
								<TableCell>
									{admin.firstName} {admin.lastName}
								</TableCell>
								<TableCell>{admin.email}</TableCell>
								<TableCell>{admin.department}</TableCell>
								<TableCell>{formatDate(admin.createdAt)}</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Menüyü aç</span>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => handleEdit(admin)}
											>
												<Pencil className="mr-2 h-4 w-4" />
												Düzenle
											</DropdownMenuItem>
											{admin.id !== session?.user?.id && (
												<DropdownMenuItem
													onClick={() => handleDelete(admin)}
													className="text-red-600"
												>
													<Trash className="mr-2 h-4 w-4" />
													Sil
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedAdmin ? 'Yönetici Düzenle' : 'Yönetici Ekle'}
						</DialogTitle>
					</DialogHeader>
					<AdminDialog
						admin={selectedAdmin}
						onSuccess={handleClose}
					/>
				</DialogContent>
			</Dialog>

			<AdminDeleteDialog
				admin={selectedAdmin}
				isOpen={isDeleteDialogOpen}
				onClose={handleDeleteClose}
			/>
		</div>
	)
}
