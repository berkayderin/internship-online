import { useEffect } from 'react'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useCreateAdmin, useUpdateAdmin } from '../queries/useAdmin'
import { createAdminSchema, updateAdminSchema } from '../zod/admin'

const departments = [
	'Yazılım Mühendisliği',
	'Bilişim Sistemleri Mühendisliği'
]

export function AdminDialog({ admin, onSuccess }) {
	const createAdmin = useCreateAdmin()
	const updateAdmin = useUpdateAdmin()
	const isEditing = !!admin

	const form = useForm({
		resolver: zodResolver(
			isEditing ? updateAdminSchema : createAdminSchema
		),
		defaultValues: {
			firstName: admin?.firstName || '',
			lastName: admin?.lastName || '',
			email: admin?.email || '',
			department: admin?.department || '',
			password: ''
		}
	})

	useEffect(() => {
		if (admin) {
			form.reset({
				firstName: admin.firstName,
				lastName: admin.lastName,
				department: admin.department
			})
		} else {
			form.reset({
				firstName: '',
				lastName: '',
				email: '',
				department: '',
				password: ''
			})
		}
	}, [admin, form])

	const onSubmit = async (values) => {
		try {
			if (isEditing) {
				const { email, password, ...updateData } = values
				await updateAdmin.mutateAsync({
					id: admin.id,
					data: updateData
				})
			} else {
				await createAdmin.mutateAsync(values)
			}
			onSuccess?.()
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
			>
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
				{!isEditing && (
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-posta</FormLabel>
								<FormControl>
									<Input {...field} type="email" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				<FormField
					control={form.control}
					name="department"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bölüm</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Bölüm seçin" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{departments.map((department) => (
										<SelectItem key={department} value={department}>
											{department}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{!isEditing && (
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Şifre</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={createAdmin.isPending || updateAdmin.isPending}
					>
						{isEditing ? 'Güncelle' : 'Oluştur'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
