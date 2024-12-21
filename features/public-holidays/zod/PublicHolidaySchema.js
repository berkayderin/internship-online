import * as z from 'zod'

const publicHolidaySchema = z
	.object({
		type: z.enum([
			'NEW_YEAR',
			'RAMADAN',
			'NATIONAL_SOVEREIGNTY',
			'LABOR_DAY',
			'COMMEMORATION_YOUTH',
			'SACRIFICE',
			'DEMOCRACY',
			'VICTORY',
			'REPUBLIC'
		]),
		startDate: z.coerce.date(),
		endDate: z.coerce.date()
	})
	.refine((data) => data.endDate >= data.startDate, {
		message: 'Bitiş tarihi başlangıç tarihinden önce olamaz',
		path: ['endDate']
	})

export default publicHolidaySchema
