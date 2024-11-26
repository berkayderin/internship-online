import * as z from 'zod'

const registerSchema = z.object({
	firstName: z
		.string({
			required_error: 'Ad gereklidir'
		})
		.min(2, {
			message: 'Ad en az 2 karakter olmalıdır'
		}),
	lastName: z
		.string({
			required_error: 'Soyad gereklidir'
		})
		.min(2, {
			message: 'Soyad en az 2 karakter olmalıdır'
		}),
	department: z
		.string({
			required_error: 'Bölüm gereklidir'
		})
		.min(2, {
			message: 'Bölüm en az 2 karakter olmalıdır'
		}),
	email: z
		.string({
			required_error: 'E-posta adresi gereklidir'
		})
		.email({
			message: 'Geçerli bir e-posta adresi giriniz'
		}),
	password: z
		.string({
			required_error: 'Şifre gereklidir'
		})
		.min(6, {
			message: 'Şifre en az 6 karakter olmalıdır'
		})
})

export default registerSchema
