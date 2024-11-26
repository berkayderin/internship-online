// features/student-activities/components/StudentList.jsx
import { format } from 'date-fns'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

export function StudentList({ students, onStudentSelect }) {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Ad Soyad</TableHead>
							<TableHead>Bölüm</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Staj Başlangıç</TableHead>
							<TableHead>Staj Bitiş</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students?.map((student) => (
							<TableRow
								key={student.id}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => onStudentSelect(student)}
							>
								<TableCell className="font-medium hover:underline">
									{student.firstName} {student.lastName}
								</TableCell>
								<TableCell>{student.department}</TableCell>
								<TableCell>{student.email}</TableCell>
								<TableCell>
									{student.startDate
										? format(
												new Date(student.startDate),
												'dd/MM/yyyy'
										  )
										: '-'}
								</TableCell>
								<TableCell>
									{student.endDate
										? format(new Date(student.endDate), 'dd/MM/yyyy')
										: '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
