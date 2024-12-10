// features/student-activities/components/StudentList.jsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Eye, Trash2 } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function StudentList({
	students = [],
	onStudentSelect,
	onStudentDelete
}) {
	const [studentToDelete, setStudentToDelete] = useState(null)

	const handleDeleteConfirm = () => {
		onStudentDelete(studentToDelete)
		setStudentToDelete(null)
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
			<div className="rounded-md border">
				<Table className="w-[1400px]">
					<TableHeader>
						<TableRow>
							<TableHead>Ad Soyad</TableHead>
							<TableHead>E-posta</TableHead>
							<TableHead>Bölüm</TableHead>
							<TableHead className="w-[150px]">İşlemler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!students.length ? (
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
										<div className="flex items-center gap-2">
											<button
												onClick={() => onStudentSelect(student.id)}
												className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
											>
												<Eye className="h-4 w-4" />
												Detay Görüntüle
											</button>
											<button
												onClick={() => setStudentToDelete(student.id)}
												className="text-red-600 hover:text-red-800 hover:underline dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
											>
												<Trash2 className="h-4 w-4" />
												Sil
											</button>
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
						<DialogTitle>
							Öğrenciyi silmek istediğinizden emin misiniz?
						</DialogTitle>
						<DialogDescription>
							Bu işlem geri alınamaz. Öğrencinin tüm aktiviteleri ve
							verileri silinecektir.
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
