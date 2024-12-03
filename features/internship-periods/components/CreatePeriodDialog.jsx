// features/internship-periods/components/CreatePeriodDialog.jsx
import { useState } from 'react'
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
import { useCreateInternshipPeriod } from '../queries/useInternshipPeriod'

export function CreatePeriodDialog({ open, onOpenChange }) {
	const form = useForm({
		resolver: zodResolver(internshipPeriodSchema),
		defaultValues: {
			name: '',
			startDate: new Date(),
			endDate: new Date()
		}
	})

	const createPeriod = useCreateInternshipPeriod()

	const onSubmit = async (values) => {
		try {
			await createPeriod.mutateAsync(values)
			form.reset()
			onOpenChange(false)
		} catch (error) {
			console.error('Error creating period:', error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Yeni Staj Dönemi Oluştur</DialogTitle>
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
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Başvuru Başlangıç Tarihi</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="pl-3 text-left font-normal"
												>
													{field.value ? (
														format(field.value, 'PPP', { locale: tr })
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
								<FormItem className="flex flex-col">
									<FormLabel>Başvuru Bitiş Tarihi</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="pl-3 text-left font-normal"
												>
													{field.value ? (
														format(field.value, 'PPP', { locale: tr })
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
						<div className="flex justify-end">
							<Button type="submit" disabled={createPeriod.isLoading}>
								{createPeriod.isLoading
									? 'Oluşturuluyor...'
									: 'Oluştur'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
