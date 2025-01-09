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
				description:
					error.message ||
					'Kayıt oluşturulamadı. Lütfen tekrar deneyin.',
				variant: 'destructive'
			})
		}
	}

	return (
		<div className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
				<div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
				<div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

				<div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-[0.02]" />

				<div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_20%,#000_100%)]" />
			</div>

			{/* Content */}
			<div className="w-full max-w-[520px] relative">
				<div className="absolute inset-0 -z-10 bg-background/50 backdrop-blur-xl rounded-2xl" />
				<div className="p-8 relative space-y-6">
					<div className="text-center space-y-2">
						<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">
							Kayıt Ol
						</h1>
						<p className="text-muted-foreground">
							Staj takip sistemine kayıt olun
						</p>
					</div>

					<AuthForm
						type="register"
						onSubmit={handleRegister}
						isSubmitting={register.isLoading}
						schema={registerSchema}
					/>
				</div>
			</div>

			<style jsx global>{`
				@keyframes blob {
					0% {
						transform: translate(0px, 0px) scale(1);
					}
					33% {
						transform: translate(30px, -50px) scale(1.1);
					}
					66% {
						transform: translate(-20px, 20px) scale(0.9);
					}
					100% {
						transform: translate(0px, 0px) scale(1);
					}
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	)
}

export default RegisterPage
