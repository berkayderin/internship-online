// features/internship-periods/zod/InternshipPeriodSchema.js
import * as z from 'zod'

const internshipPeriodSchema = z
	.object({
		name: z
			.string({
				required_error: 'Staj dönemi adı zorunludur'
			})
			.min(3, 'Staj dönemi adı en az 3 karakter olmalıdır'),
		startDate: z.coerce.date({
			required_error: 'Başlangıç tarihi zorunludur'
		}),
		endDate: z.coerce.date({
			required_error: 'Bitiş tarihi zorunludur'
		})
	})
	.refine((data) => data.endDate > data.startDate, {
		message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
		path: ['endDate']
	})

export default internshipPeriodSchema
