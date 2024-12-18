// features/applications/components/ApplicationDialog.jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { format } from 'date-fns'

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
import {
	useCreateApplication,
	useInternshipPeriod,
	useUpdateApplicationByUser
} from '../queries/useApplication'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

export function ApplicationDialog({
	open,
	onOpenChange,
	periodId,
	initialData,
	mode,
	onSubmit
}) {
	const { data: period, isLoading } = useInternshipPeriod(periodId)
	const updateApplicationByUser = useUpdateApplicationByUser()
	const createApplication = useCreateApplication()

	const form = useForm({
		resolver: zodResolver(applicationSchema, {
			contextualData: {
				period: period
			}
		}),
		defaultValues: initialData
			? {
					...initialData,
					internshipStartDate: initialData.internshipStartDate
						? new Date(initialData.internshipStartDate)
						: '',
					internshipEndDate: initialData.internshipEndDate
						? new Date(initialData.internshipEndDate)
						: ''
			  }
			: {
					periodId: '',
					companyName: '',
					companyPhone: '',
					companyWebsite: '',
					companyAddress: '',
					companyEmployeeCount: '',
					internshipStartDate: '',
					internshipEndDate: ''
			  }
	})

	useEffect(() => {
		if (periodId) {
			form.setValue('periodId', periodId)
		}
	}, [periodId, form])

	const handleFormSubmit = async (data) => {
		try {
			const formattedData = {
				...data,
				periodId: periodId,
				internshipStartDate: new Date(
					data.internshipStartDate
				).toISOString(),
				internshipEndDate: new Date(
					data.internshipEndDate
				).toISOString()
			}

			if (mode === 'edit') {
				await onSubmit(formattedData)
			} else {
				await createApplication.mutateAsync(formattedData)
			}

			onOpenChange(false)
			form.reset()
		} catch (error) {
			console.error('Submit Error:', error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{mode === 'edit' ? 'Başvuru Düzenle' : 'Staj Başvurusu'}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleFormSubmit)}
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

						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="internshipStartDate"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Başlangıç Tarihi</FormLabel>
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
															format(field.value, 'PPP', {
																locale: tr
															})
														) : (
															<span>Tarih seçin</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date <
															new Date(period?.internshipStartDate) ||
														date > new Date(period?.internshipEndDate)
													}
													initialFocus
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
									<FormItem className="flex-1">
										<FormLabel>Bitiş Tarihi</FormLabel>
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
															format(field.value, 'PPP', {
																locale: tr
															})
														) : (
															<span>Tarih seçin</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date <
															new Date(period?.internshipStartDate) ||
														date > new Date(period?.internshipEndDate)
													}
													locale={tr}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
