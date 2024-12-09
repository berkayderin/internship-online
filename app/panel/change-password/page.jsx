'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema } from '@/features/auth/zod/ChangePasswordSchema'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
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
import { toast } from '@/hooks/use-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [showCurrentPassword, setShowCurrentPassword] =
		useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] =
		useState(false)

	const form = useForm({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error)
			}

			toast({
				title: 'Başarılı',
				description: 'Şifreniz başarıyla güncellendi'
			})

			form.reset()
		} catch (error) {
			toast({
				title: 'Hata',
				description: error.message,
				variant: 'destructive'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container max-w-lg">
			<Card>
				<CardHeader>
					<CardTitle>Şifre Değiştir</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mevcut Şifre</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showCurrentPassword ? 'text' : 'password'
													}
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowCurrentPassword(
															!showCurrentPassword
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
												>
													{showCurrentPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Yeni Şifre</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showNewPassword ? 'text' : 'password'}
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowNewPassword(!showNewPassword)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
												>
													{showNewPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Yeni Şifre Tekrar</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showConfirmPassword ? 'text' : 'password'
													}
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
												>
													{showConfirmPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
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
								disabled={isLoading}
							>
								{isLoading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
