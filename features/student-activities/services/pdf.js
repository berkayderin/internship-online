import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts

export const generateActivityReport = (student, activities) => {
	const docDefinition = {
		content: [
			{ text: 'Staj Aktivite Raporu', style: 'header' },
			{ text: '\n' },
			{
				text: [
					{ text: 'Öğrenci: ', bold: true },
					`${student.firstName} ${student.lastName}\n`,
					{ text: 'Bölüm: ', bold: true },
					`${student.department}\n`
				]
			},
			{ text: '\n' },
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*'],
					body: [
						[
							{ text: 'Tarih', style: 'tableHeader' },
							{ text: 'Aktivite İçeriği', style: 'tableHeader' }
						],
						...activities.map((activity) => [
							new Date(activity.date).toLocaleDateString('tr-TR'),
							activity.content.replace(/<[^>]*>/g, '')
						])
					]
				}
			}
		],
		styles: {
			header: {
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 10]
			},
			tableHeader: {
				bold: true,
				fillColor: '#eeeeee'
			}
		},
		defaultStyle: {
			fontSize: 10
		}
	}

	return pdfMake.createPdf(docDefinition)
}
