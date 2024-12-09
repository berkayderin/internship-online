// features/student-activities/components/StudentList.jsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Eye } from 'lucide-react'

export function StudentList({ students = [], onStudentSelect }) {
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
										<button
											onClick={() => onStudentSelect(student.id)}
											className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
										>
											<Eye className="h-4 w-4" />
											Detay Görüntüle
										</button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
