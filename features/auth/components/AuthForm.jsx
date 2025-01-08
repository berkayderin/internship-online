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
		<Card className="border border-primary/20 bg-background/30">
			<CardContent className="p-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						{type === 'register' && (
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-foreground/70 font-medium">Ad</FormLabel>
											<FormControl>
												<Input 
													{...field} 
													className="h-11 bg-background/50 border border-primary/20 focus:border-primary rounded-md"
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-foreground/70 font-medium">Soyad</FormLabel>
											<FormControl>
												<Input 
													{...field} 
													className="h-11 bg-background/50 border border-primary/20 focus:border-primary rounded-md"
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="department"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-foreground/70 font-medium">Bölüm</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger 
													className="h-11 bg-background/50 border border-primary/20 focus:border-primary focus:ring-0 focus:ring-offset-0 rounded-md"
												>
													<SelectValue placeholder="Bölüm seçiniz" />
												</SelectTrigger>
												<SelectContent className="bg-background border border-primary/20 rounded-md">
													{departments.map((department) => (
														<SelectItem
															key={department}
															value={department}
															className="focus:bg-primary/5 focus:text-foreground"
														>
															{department}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
							</div>
						)}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground/70 font-medium">E-posta</FormLabel>
									<FormControl>
										<Input
											placeholder="ornek@ogr.mehmetakif.edu.tr"
											{...field}
											className="h-11 bg-background/50 border border-primary/20 focus:border-primary rounded-md"
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-foreground/70 font-medium">Şifre</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? 'text' : 'password'}
												{...field}
												className="h-11 bg-background/50 border border-primary/20 focus:border-primary rounded-md pr-12"
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-md"
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
			<CardFooter className="flex justify-center pb-8">
				{type === 'login' ? (
					<Link 
						href="/register" 
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						Hesabınız yok mu?{' '}
						<span className="font-semibold text-primary">
							Kayıt olun
						</span>
					</Link>
				) : (
					<Link 
						href="/login" 
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						Zaten hesabınız var mı?{' '}
						<span className="font-semibold text-primary">
							Giriş yapın
						</span>
					</Link>
				)}
			</CardFooter>
		</Card>
	)
}
