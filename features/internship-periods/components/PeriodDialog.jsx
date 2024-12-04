'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

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
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import internshipPeriodSchema from '../zod/InternshipPeriodSchema'
import {
	useCreateInternshipPeriod,
	useUpdateInternshipPeriod
} from '../queries/useInternshipPeriod'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export function PeriodDialog({ open, onOpenChange, period }) {
	const isEditing = !!period
	const form = useForm({
		resolver: zodResolver(internshipPeriodSchema),
		defaultValues: {
			name: '',
			startDate: new Date(),
			endDate: new Date(),
			internshipStartDate: new Date(),
			internshipEndDate: new Date()
		}
	})

	useEffect(() => {
		if (period) {
			form.reset({
				name: period.name,
				startDate: new Date(period.startDate),
				endDate: new Date(period.endDate),
				internshipStartDate: new Date(period.internshipStartDate),
				internshipEndDate: new Date(period.internshipEndDate)
			})
		} else {
			form.reset({
				name: '',
				startDate: new Date(),
				endDate: new Date(),
				internshipStartDate: new Date(),
				internshipEndDate: new Date()
			})
		}
	}, [period, form])

	console.log('period', period)

	const createPeriod = useCreateInternshipPeriod()
	const updatePeriod = useUpdateInternshipPeriod()

	const onSubmit = async (data) => {
		try {
			if (isEditing) {
				await updatePeriod.mutateAsync({
					id: period.id,
					data
				})
			} else {
				await createPeriod.mutateAsync(data)
				form.reset()
			}
			onOpenChange(false)
		} catch (error) {
			console.error('Error saving period:', error)
		}
	}

	const isLoading = isEditing
		? updatePeriod.isLoading
		: createPeriod.isLoading

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing
							? 'Staj Dönemini Düzenle'
							: 'Yeni Staj Dönemi Oluştur'}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dönem Adı</FormLabel>
									<FormControl>
										<Input placeholder="2024 Yaz Dönemi" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col flex-1">
										<FormLabel>Başvuru Başlangıç Tarihi</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className="pl-3 text-left font-normal"
													>
														{field.value ? (
															format(field.value, 'PPP', {
																locale: tr
															})
														) : (
															<span>Tarih seçiniz</span>
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
													disabled={(date) => date < new Date()}
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
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col flex-1">
										<FormLabel>Başvuru Bitiş Tarihi</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className="pl-3 text-left font-normal"
													>
														{field.value ? (
															format(field.value, 'PPP', {
																locale: tr
															})
														) : (
															<span>Tarih seçiniz</span>
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
													disabled={(date) => date < new Date()}
													initialFocus
													locale={tr}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="internshipStartDate"
								render={({ field }) => (
									<FormItem className="flex flex-col flex-1">
										<FormLabel>Staj Başlangıç Tarihi</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															'pl-3 text-left font-normal'
														)}
													>
														{field.value ? (
															format(field.value, 'd MMMM yyyy', {
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
									<FormItem className="flex flex-col flex-1">
										<FormLabel>Staj Bitiş Tarihi</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															'pl-3 text-left font-normal'
														)}
													>
														{field.value ? (
															format(field.value, 'd MMMM yyyy', {
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
													locale={tr}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								type="button"
								onClick={() => onOpenChange(false)}
							>
								İptal
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? isEditing
										? 'Güncelleniyor...'
										: 'Oluşturuluyor...'
									: isEditing
									? 'Güncelle'
									: 'Oluştur'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
