import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.vfs

const pageStyle = {
	header: {
		fontSize: 24,
		bold: true,
		color: '#000000',
		alignment: 'center',
		margin: [0, 20, 0, 20]
	},
	subheader: {
		fontSize: 18,
		bold: true,
		color: '#000000',
		margin: [0, 15, 0, 10]
	},
	studentInfo: {
		fontSize: 12,
		margin: [0, 0, 0, 15],
		color: '#000000'
	},
	tableHeader: {
		bold: true,
		fontSize: 12,
		color: 'white',
		fillColor: '#000000',
		alignment: 'center'
	},
	tableCell: {
		fontSize: 11,
		color: '#000000',
		alignment: 'left',
		margin: [0, 5, 0, 5]
	},
	footer: {
		fontSize: 10,
		color: '#000000',
		alignment: 'center',
		margin: [0, 10, 0, 0]
	}
}

export const generateActivityReport = (student, activities) => {
	const docDefinition = {
		pageSize: {
			width: 595.28, // A4
			height: 841.89 // A4
		},
		pageMargins: [40, 20, 40, 20],
		footer: function (currentPage, pageCount) {
			return {
				columns: [
					{
						text: [
							'Bucak Bilgisayar ve Bilişim Fakültesi',
							'\nSayfa ',
							currentPage.toString(),
							' / ',
							pageCount.toString()
						],
						style: 'footer',
						alignment: 'center'
					}
				]
			}
		},
		content: [
			{ text: 'Staj Defteri Raporu', style: 'header' },
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
			{ text: 'Aktiviteler', style: 'subheader' },
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
							{
								text: new Date(activity.date).toLocaleDateString(
									'tr-TR'
								),
								style: 'tableCell'
							},
							{
								text: activity.content.replace(/<[^>]*>/g, ''),
								style: 'tableCell'
							}
						])
					]
				}
			}
		],
		styles: pageStyle,
		defaultStyle: {
			font: 'Roboto',
			color: '#000000'
		}
	}

	return pdfMake.createPdf(docDefinition)
}

export const generateSummaryReport = (student, summary) => {
	const docDefinition = {
		pageSize: {
			width: 595.28, // A4
			height: 841.89 // A4
		},
		pageMargins: [40, 20, 40, 20],
		footer: function (currentPage, pageCount) {
			return {
				columns: [
					{
						text: [
							'Bucak Bilgisayar ve Bilişim Fakültesi',
							'\nSayfa ',
							currentPage.toString(),
							' / ',
							pageCount.toString()
						],
						style: 'footer',
						alignment: 'center'
					}
				]
			}
		},
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
		],
		styles: pageStyle,
		defaultStyle: {
			font: 'Roboto',
			color: '#000000'
		}
	}

	return pdfMake.createPdf(docDefinition)
}
