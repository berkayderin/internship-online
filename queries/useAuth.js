// queries/useAuth.js
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/services/auth'
import { signIn } from 'next-auth/react'

export const useLogin = () => {
	return useMutation({
		mutationFn: async (credentials) => {
			const result = await signIn('credentials', {
				redirect: false,
				email: credentials.email,
				password: credentials.password
			})

			if (result?.error) {
				throw new Error(result.error)
			}

			return result
		}
	})
}

export const useRegister = () => {
	return useMutation({
		mutationFn: registerUser
	})
}
