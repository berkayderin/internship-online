'use client'

import { useRouter } from 'next/navigation'
import { AuthForm } from '@/features/auth/components/AuthForm'
import { useRegister } from '@/features/auth/queries/useAuth'
import { toast } from '@/hooks/use-toast'
import registerSchema from '@/features/auth/zod/RegisterSchema'

const RegisterPage = () => {
	const router = useRouter()
	const register = useRegister()

	const handleRegister = async (data) => {
		try {
			await register.mutateAsync(data)
			toast({
				title: 'Kayıt başarılı',
				description: 'Giriş sayfasına yönlendiriliyorsunuz.'
			})
			router.push('/login')
		} catch (error) {
			toast({
				title: 'Hata',
				description: 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.',
				variant: 'destructive'
			})
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-[520px]">
				<AuthForm
					type="register"
					onSubmit={handleRegister}
					isSubmitting={register.isLoading}
					schema={registerSchema}
				/>
			</div>
		</div>
	)
}

export default RegisterPage
