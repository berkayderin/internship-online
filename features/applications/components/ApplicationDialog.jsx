// features/applications/components/ApplicationDialog.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import applicationSchema from '../zod/ApplicationSchema'
import { useCreateApplication } from '../queries/useApplication'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export function ApplicationDialog({ open, onOpenChange, periodId }) {
	const form = useForm({
		resolver: zodResolver(applicationSchema),
		defaultValues: {
			periodId: periodId || '',
			companyName: '',
			companyPhone: '',
			companyWebsite: '',
			companyEmployeeCount: 0,
			companyEngineerCount: 0,
			companyAddress: '',
			internshipStartDate: null,
			internshipEndDate: null
		}
	})

	useEffect(() => {
		form.setValue('periodId', periodId || '')
	}, [periodId, form])

	const createApplication = useCreateApplication()

	const onSubmit = async (values) => {
		try {
			await createApplication.mutateAsync({
				...values,
				companyWebsite: values.companyWebsite || '',
				companyEmployeeCount: Number(values.companyEmployeeCount),
				companyEngineerCount: Number(values.companyEngineerCount)
			})
			form.reset()
			onOpenChange(false)
		} catch (error) {
			console.error('Error submitting application:', error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Staj Başvurusu</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (errors) => {
							console.log('errors:', errors)
						})}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="companyName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>İşyeri Adı</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="companyPhone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>İşyeri Telefonu</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="companyWebsite"
							render={({ field }) => (
								<FormItem>
									<FormLabel>İşyeri Web Adresi (Opsiyonel)</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value || ''}
											placeholder="https://example.com"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="companyEmployeeCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Toplam Çalışan Sayısı</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="1"
												{...field}
												onChange={(e) =>
													field.onChange(Number(e.target.value))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="companyEngineerCount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Toplam Mühendis Sayısı</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="1"
												{...field}
												onChange={(e) =>
													field.onChange(Number(e.target.value))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="companyAddress"
							render={({ field }) => (
								<FormItem>
									<FormLabel>İşyeri Adresi</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="internshipStartDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Staj Başlangıç Tarihi</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															'w-full pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															format(field.value, 'd MMMM yyyy', {
																locale: tr
															})
														) : (
															<span>Tarih seçin</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													locale={tr}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="internshipEndDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Staj Bitiş Tarihi</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															'w-full pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															format(field.value, 'd MMMM yyyy', {
																locale: tr
															})
														) : (
															<span>Tarih seçin</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													locale={tr}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={createApplication.isLoading}
							>
								{createApplication.isLoading
									? 'Gönderiliyor...'
									: 'Gönder'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
