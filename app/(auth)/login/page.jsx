'use client'

import { useRouter } from 'next/navigation'

import { toast } from '@/hooks/use-toast'
import loginSchema from '@/features/auth/zod/LoginSchema'
import { AuthForm } from '@/features/auth/components/AuthForm'
import { useLogin } from '@/features/auth/queries/useAuth'

const LoginPage = () => {
	const router = useRouter()
	const login = useLogin()

	const handleLogin = async (data) => {
		try {
			await login.mutateAsync(data)
			toast({
				title: 'Giriş başarılı',
				description: 'Panel sayfasına yönlendiriliyorsunuz.'
			})
			router.push('/panel')
			router.refresh()
		} catch (error) {
			toast({
				title: 'Hata',
				description: 'Giriş yapılamadı. Bilgilerinizi kontrol edin.',
				variant: 'destructive'
			})
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<AuthForm
				type="login"
				onSubmit={handleLogin}
				isSubmitting={login.isLoading}
				schema={loginSchema}
			/>
		</div>
	)
}

export default LoginPage
