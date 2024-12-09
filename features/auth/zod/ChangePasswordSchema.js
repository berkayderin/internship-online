import * as z from 'zod'

export const changePasswordSchema = z
	.object({
		currentPassword: z.string({
			required_error: 'Mevcut şifre gereklidir'
		}),
		newPassword: z
			.string({
				required_error: 'Yeni şifre gereklidir'
			})
			.min(6, {
				message: 'Şifre en az 6 karakter olmalıdır'
			}),
		confirmPassword: z.string({
			required_error: 'Şifre tekrarı gereklidir'
		})
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Şifreler eşleşmiyor',
		path: ['confirmPassword']
	})
