import * as z from 'zod'

const registerSchema = z.object({
	fullname: z.string().min(3, {
		message: 'Ad en az 3 karakter olmalıdır'
	}),
	email: z.string().email({
		message: 'Geçerli bir email adresi giriniz'
	}),
	password: z.string().min(6, {
		message: 'Şifre en az 6 karakter olmalıdır'
	})
})

export default registerSchema
