export async function getApplicationStats() {
	const response = await fetch('/api/applications')
	const applications = await response.json()

	const stats = {
		pending: 0,
		approved: 0,
		rejected: 0
	}

	applications.forEach((app) => {
		if (app.status === 'PENDING') stats.pending++
		if (app.status === 'APPROVED') stats.approved++
		if (app.status === 'REJECTED') stats.rejected++
	})

	return stats
}

export async function getStudentStats() {
	const response = await fetch('/api/students')
	const students = await response.json()

	const stats = students.reduce((acc, student) => {
		acc[student.department] = (acc[student.department] || 0) + 1
		return acc
	}, {})

	return stats
}
