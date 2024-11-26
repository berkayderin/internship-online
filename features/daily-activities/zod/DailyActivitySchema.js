// features/daily-activities/zod/DailyActivitySchema.js
import * as z from 'zod'

const dailyActivitySchema = z.object({
	date: z.coerce
		.date({
			required_error: 'Tarih seçiniz',
			invalid_type_error: 'Geçerli bir tarih seçiniz'
		})
		.refine((date) => {
			const now = new Date()
			const threeDaysAgo = new Date(now.setDate(now.getDate() - 3))
			const threeDaysLater = new Date(
				new Date().setDate(new Date().getDate() + 3)
			)
			return date >= threeDaysAgo && date <= threeDaysLater
		}, 'Aktivite tarihi en fazla 3 gün öncesi veya 3 gün sonrası için seçilebilir'),
	content: z
		.string({
			required_error: 'Aktivite içeriği gereklidir'
		})
		.min(10, 'Aktivite içeriği en az 10 karakter olmalıdır')
		.trim()
})

export default dailyActivitySchema
