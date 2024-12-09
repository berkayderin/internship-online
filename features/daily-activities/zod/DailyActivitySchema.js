// features/daily-activities/zod/DailyActivitySchema.js
import * as z from 'zod'
import {
	startOfWeek,
	endOfWeek,
	isWithinInterval,
	isSameWeek
} from 'date-fns'

const dailyActivitySchema = z.object({
	date: z.coerce
		.date({
			required_error: 'Tarih seçiniz',
			invalid_type_error: 'Geçerli bir tarih seçiniz'
		})
		.refine((date) => {
			const today = new Date()
			const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
			const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 })

			return (
				isWithinInterval(date, {
					start: currentWeekStart,
					end: currentWeekEnd
				}) && isSameWeek(date, today, { weekStartsOn: 1 })
			)
		}, 'Sadece bu haftaya (Pazartesi-Pazar) ait günlük ekleyebilirsiniz'),
	content: z
		.string({
			required_error: 'Aktivite içeriği gereklidir'
		})
		.min(10, 'Aktivite içeriği en az 10 karakter olmalıdır')
		.trim()
})

export default dailyActivitySchema
