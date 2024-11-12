// app/reigster/page.jsx
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
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import registerSchema from '@/lib/schemas/RegisterSchema'
import { useRouter } from 'next/navigation'
import { useRegister } from '@/queries/useAuth'
import { toast } from '@/hooks/use-toast'

export default function RegisterPage() {
	const router = useRouter()
	const register = useRegister()

	const [showPassword, setShowPassword] = useState(false)

	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			fullname: '',
			email: '',
			password: ''
		}
	})

	const onSubmit = async (data) => {
		try {
			await register.mutateAsync(data)
			toast({
				title: 'Kayıt başarılı',
				description: 'Giriş sayfasına yönlendiriliyorsunuz.'
			})
			router.push('/login')
		} catch (error) {
			console.error('Kayıt hatası:', error)
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Kayıt Ol</CardTitle>
					<CardDescription>Hesabınızı oluşturun</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-2"
						>
							<FormField
								control={form.control}
								name="fullname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ad Soyad</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
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
				<CardFooter className="flex flex-col justify-center">
					<Link
						href="/login"
						className="text-sm text-black hover:underline"
					>
						Zaten bir hesabınız var mı?{' '}
						<span className="font-semibold">Giriş Yap</span>
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
