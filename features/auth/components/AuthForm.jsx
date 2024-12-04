// features/auth/components/AuthForm.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '@/components/ui/select'

const departments = [
	'Yazılım Mühendisliği',
	'Bilişim Sistemleri Mühendisliği'
]

export function AuthForm({
	type = 'login',
	onSubmit,
	isSubmitting,
	schema
}) {
	const [showPassword, setShowPassword] = useState(false)

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			...(type === 'register' && {
				firstName: '',
				lastName: '',
				department: ''
			}),
			email: '',
			password: ''
		}
	})

	const handleSubmit = async (data) => {
		try {
			await onSubmit(data)
		} catch (error) {
			console.error(`${type} error:`, error)
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{type === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
				</CardTitle>
				<CardDescription>
					{type === 'login'
						? 'Hesabınıza giriş yapın'
						: 'Yeni bir hesap oluşturun'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						{type === 'register' && (
							<>
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ad</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Soyad</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="department"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bölüm</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Bölüm seçiniz" />
												</SelectTrigger>
												<SelectContent>
													{departments.map((department) => (
														<SelectItem
															key={department}
															value={department}
														>
															{department}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
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
									<FormMessage />
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
												onClick={() => setShowPassword(!showPassword)}
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting
								? 'İşleniyor...'
								: type === 'login'
								? 'Giriş Yap'
								: 'Kayıt Ol'}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-center">
				{type === 'login' ? (
					<Link href="/register" className="text-sm hover:underline">
						Hesabınız yok mu?{' '}
						<span className="font-semibold">Kayıt olun</span>
					</Link>
				) : (
					<Link href="/login" className="text-sm hover:underline">
						Zaten hesabınız var mı?{' '}
						<span className="font-semibold">Giriş yapın</span>
					</Link>
				)}
			</CardFooter>
		</Card>
	)
}
