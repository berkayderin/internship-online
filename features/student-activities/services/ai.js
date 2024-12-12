import { GoogleGenerativeAI } from '@google/generative-ai'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.vfs

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

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

		const prompt = `Aşağıdaki staj aktivitelerini analiz et ve iki bölümden oluşan bir yanıt ver. 
Sadece teknoloji isimleri, programlama dilleri, yazılım araçları ve önemli teknik kavramları **kelime** şeklinde belirt. 
Normal cümle yapısındaki kelimeleri kalınlaştırma.

1. Özet: Aktiviteleri profesyonel bir dille özetle. Öğrencinin yaptığı işleri, öğrendiği teknolojileri ve kazandığı deneyimleri vurgula. Özet kısa olmalı.

2. Değerlendirme: Aktiviteleri aşağıdaki kriterlere göre değerlendir ve detaylı gerekçesiyle birlikte bir seviye belirt:
- Kötü: Yetersiz aktivite ve öğrenme
- Orta: Temel düzeyde aktivite ve öğrenme
- İyi: Tatmin edici düzeyde aktivite ve öğrenme
- Çok iyi: Beklentilerin üzerinde aktivite ve öğrenme
- Mükemmel: Olağanüstü performans ve öğrenme

Örnek kalınlaştırma:
- Doğru: Stajyer **React.js**, **Node.js** ve **MongoDB** teknolojilerini kullanarak web uygulaması geliştirdi.
- Yanlış: **Stajyer** React.js, Node.js ve MongoDB **teknolojilerini** **kullanarak** web uygulaması **geliştirdi**.

Aktiviteler:
${activitiesText}`

		const result = await model.generateContent(prompt)
		const response = result.response
		const text = response.text()

		const formattedText = text
			.split(/(\*\*[^*]+\*\*)/)
			.map((part) => {
				if (part.startsWith('**') && part.endsWith('**')) {
					const boldText = part.slice(2, -2)
					return { text: boldText, bold: true }
				}
				return part
			})

		return formattedText
	} catch (error) {
		console.error('Summarize activities error:', error)
	}
}

export const generateSummaryReport = (student, summary) => {
	const docDefinition = {
		content: [
			{ text: 'Staj Aktiviteleri Özet Raporu', style: 'header' },
			{
				style: 'studentInfo',
				table: {
					widths: ['auto', '*'],
					body: [
						[
							{ text: 'Öğrenci:', bold: true },
							`${student.firstName} ${student.lastName}`
						],
						[{ text: 'Bölüm:', bold: true }, student.department]
					]
				},
				layout: 'noBorders'
			},
			{ text: 'Yapay Zeka Değerlendirmesi', style: 'subheader' },
			{
				text: summary,
				style: 'tableCell',
				margin: [0, 10, 0, 0]
			}
		]
	}

	return pdfMake.createPdf(docDefinition)
}
