// features/applications/zod/ApplicationSchema.js
import * as z from 'zod'

const applicationSchema = z
	.object({
		periodId: z.string({
			required_error: 'Staj dönemi seçilmelidir'
		}),
		companyName: z
			.string({
				required_error: 'İşyeri adı gereklidir'
			})
			.min(2, 'İşyeri adı en az 2 karakter olmalıdır'),
		companyPhone: z
			.string({
				required_error: 'İşyeri telefonu zorunludur'
			})
			.min(10, 'Geçerli bir telefon numarası giriniz'),
		companyWebsite: z
			.string()
			.url('Geçerli bir web adresi giriniz')
			.nullable()
			.optional()
			.transform((val) => val || ''), // Boş string'e çevir
		companyEmployeeCount: z
			.number({
				required_error: 'Çalışan sayısı zorunludur',
				invalid_type_error: 'Çalışan sayısı sayı olmalıdır'
			})
			.min(1, 'Çalışan sayısı en az 1 olmalıdır'),
		companyEngineerCount: z
			.number({
				required_error: 'Mühendis sayısı zorunludur',
				invalid_type_error: 'Mühendis sayısı sayı olmalıdır'
			})
			.min(1, 'Mühendis sayısı en az 1 olmalıdır'),
		companyAddress: z
			.string({
				required_error: 'İşyeri adresi zorunludur'
			})
			.min(10, 'Geçerli bir adres giriniz'),
		internshipStartDate: z.coerce.date({
			required_error: 'Staj başlangıç tarihi gereklidir'
		}),
		internshipEndDate: z.coerce.date({
			required_error: 'Staj bitiş tarihi gereklidir'
		})
	})
	.refine(
		(data) => data.companyEngineerCount <= data.companyEmployeeCount,
		{
			message:
				'Mühendis sayısı toplam çalışan sayısından fazla olamaz',
			path: ['companyEngineerCount']
		}
	)
	.refine(
		(data) => data.internshipEndDate > data.internshipStartDate,
		{
			message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
			path: ['internshipEndDate']
		}
	)
	.superRefine((data, ctx) => {
		const period = ctx?.contextualData?.period

		if (!period) {
			console.log('Period bilgisi bulunamadı')
			return
		}

		console.log('Validation Data:', {
			formStartDate: new Date(data.internshipStartDate),
			formEndDate: new Date(data.internshipEndDate),
			periodStartDate: new Date(period.internshipStartDate),
			periodEndDate: new Date(period.internshipEndDate)
		})

		// Seçilen başlangıç tarihi kontrol
		if (
			new Date(data.internshipStartDate) <
			new Date(period.internshipStartDate)
		) {
			console.log('Başlangıç tarihi hatası')
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Staj başlangıç tarihi dönem başlangıcından önce olamaz',
				path: ['internshipStartDate']
			})
		}

		// Seçilen bitiş tarihi kontrol
		if (
			new Date(data.internshipEndDate) >
			new Date(period.internshipEndDate)
		) {
			console.log('Bitiş tarihi hatası')
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Staj bitiş tarihi dönem bitişinden sonra olamaz',
				path: ['internshipEndDate']
			})
		}
	})

export default applicationSchema
