// features/student-activities/components/StudentList.jsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

export function StudentList({ students = [], onStudentSelect }) {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Ad Soyad</TableHead>
							<TableHead>E-posta</TableHead>
							<TableHead>Bölüm</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students.map((student) => (
							<TableRow
								key={student.id}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => onStudentSelect(student.id)}
							>
								<TableCell>
									{student.firstName} {student.lastName}
								</TableCell>
								<TableCell>{student.email}</TableCell>
								<TableCell>{student.department}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
