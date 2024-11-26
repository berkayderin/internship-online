// zod/DailyActivitySchema.js
import * as z from 'zod'

const dailyActivitySchema = z.object({
	date: z.coerce.date({
		required_error: 'Tarih seçiniz',
		invalid_type_error: 'Geçerli bir tarih seçiniz'
	}),
	content: z
		.string({
			required_error: 'Aktivite içeriği gereklidir'
		})
		.min(10, 'Aktivite içeriği en az 10 karakter olmalıdır')
		.trim()
})

export default dailyActivitySchema
