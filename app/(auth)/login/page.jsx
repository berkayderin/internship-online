// app/login/page.jsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import loginSchema from '@/lib/schemas/LoginSchema'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useLogin } from '@/queries/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
	const router = useRouter()
	const login = useLogin()

	const [showPassword, setShowPassword] = useState(false)

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = async (data) => {
		try {
			await login.mutateAsync(data)
			router.push('/panel')
			router.refresh()
		} catch (error) {
			console.error('Giriş hatası:', error)
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Giriş Yap</CardTitle>
					<CardDescription>Hesabınıza giriş yapın</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-posta</FormLabel>
										<FormControl>
											<Input
												placeholder="ornek@ogr.mehmetakif.edu.tr"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Şifre</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowPassword(!showPassword)
													}
													className="absolute inset-y-0 right-4 pr-1 flex items-center text-gray-400 hover:text-gray-600"
												>
													{showPassword ? (
														<EyeOff className="h-5 w-5" />
													) : (
														<Eye className="h-5 w-5" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Giriş Yap
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<Link
						href="/register"
						className="text-sm text-black hover:underline"
					>
						Hesabınız yok mu?{' '}
						<span className="font-semibold"> Kayıt olun </span>
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
