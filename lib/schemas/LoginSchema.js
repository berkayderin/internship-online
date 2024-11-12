// lib/schemas/LoginSchema.js
import * as z from 'zod'

const loginSchema = z.object({
	email: z.string().email({
		message: 'Geçerli bir email adresi giriniz'
	}),
	password: z.string().min(6, {
		message: 'Şifre en az 6 karakter olmalıdır'
	})
})

export default loginSchema
