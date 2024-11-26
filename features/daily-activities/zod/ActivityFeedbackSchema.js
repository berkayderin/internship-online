// features/daily-activities/zod/ActivityFeedbackSchema.js
import * as z from 'zod'

const activityFeedbackSchema = z.object({
	status: z.enum(['APPROVED', 'REJECTED'], {
		required_error: 'Onay durumu seçiniz'
	}),
	feedback: z.string().optional()
})

export default activityFeedbackSchema
