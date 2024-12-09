import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
	process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
)

export const summarizeActivities = async (activities) => {
	try {
		const model = genAI.getGenerativeModel({
			model: 'gemini-1.5-pro'
		})

		const activitiesText = activities
			.map(
				(activity) =>
					`Tarih: ${new Date(activity.date).toLocaleDateString(
						'tr-TR'
					)}\nİçerik: ${activity.content.replace(/<[^>]*>/g, '')}\n`
			)
			.join('\n')

		const prompt = `Aşağıdaki staj aktivitelerini profesyonel bir dille özetle. Öğrencinin yaptığı işleri, öğrendiği teknolojileri ve kazandığı deneyimleri vurgula:

    ${activitiesText}`

		const result = await model.generateContent(prompt)
		const response = result.response
		return response.text()
	} catch (error) {
		console.error('AI özet oluşturma hatası:', error)
		throw error
	}
}
