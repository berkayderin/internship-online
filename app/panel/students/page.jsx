// app/panel/students/page.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
	useStudents,
	useDeleteStudent
} from '@/features/student-activities/queries/useStudentQueries'

const StudentsPage = () => {
	const router = useRouter()
	const { data: students } = useStudents()
	const deleteStudentMutation = useDeleteStudent()
	const [studentToDelete, setStudentToDelete] = useState(null)

	const handleStudentSelect = (studentId) => {
		router.push(`/panel/student-activities?studentId=${studentId}`)
	}

	const handleStudentDelete = async (studentId) => {
		await deleteStudentMutation.mutateAsync(studentId)
		setStudentToDelete(null)
	}

	const handleDeleteConfirm = () => {
		handleStudentDelete(studentToDelete)
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
			<div className="rounded-md border">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead>Ad Soyad</TableHead>
							<TableHead>E-posta</TableHead>
							<TableHead>Bölüm</TableHead>
							<TableHead className="w-[150px]">İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!students?.length ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-muted-foreground"
								>
									Henüz hiç öğrenci bulunmuyor.
								</TableCell>
							</TableRow>
						) : (
							students.map((student) => (
								<TableRow key={student.id}>
									<TableCell>
										{student.firstName} {student.lastName}
									</TableCell>
									<TableCell>{student.email}</TableCell>
									<TableCell>{student.department}</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													handleStudentSelect(student.id)
												}
											>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setStudentToDelete(student.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={!!studentToDelete}
				onOpenChange={() => setStudentToDelete(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Öğrenciyi Sil</DialogTitle>
						<DialogDescription>
							Bu öğrenciyi silmek istediğinizden emin misiniz? Bu
							işlem geri alınamaz.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setStudentToDelete(null)}
						>
							İptal
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteConfirm}
						>
							Sil
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default StudentsPage
