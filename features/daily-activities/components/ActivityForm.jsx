// features/daily-activities/components/ActivityForm.jsx
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import RichTextEditor from '@/components/text-editor'
import dailyActivitySchema from '@/features/daily-activities/zod/DailyActivitySchema'

export function ActivityForm({
	defaultValues,
	onSubmit,
	isSubmitting
}) {
	const form = useForm({
		resolver: zodResolver(dailyActivitySchema),
		defaultValues: {
			date: defaultValues?.date || new Date(),
			content: defaultValues?.content || ''
		}
	})

	const handleSubmit = async (values) => {
		try {
			console.log('Form values:', values) // Gönderilen veriyi kontrol et
			const formData = {
				...values,
				date: new Date(values.date)
			}
			console.log('Processed form data:', formData) // İşlenmiş veriyi kontrol et
			await onSubmit(formData)
		} catch (error) {
			console.error('Form submission error:', error)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Tarih</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											className={cn(
												'w-[240px] pl-3 text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value ? (
												format(new Date(field.value), 'PPP', {
													locale: tr
												})
											) : (
												<span>Tarih seçiniz</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={new Date(field.value)}
										onSelect={field.onChange}
										disabled={(date) =>
											date > new Date() ||
											date < new Date('1900-01-01')
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Günlük Aktivite</FormLabel>
							<FormControl>
								<RichTextEditor {...field} />
							</FormControl>
							<FormDescription>
								Günlük staj aktivitelerinizi detaylı bir şekilde
								yazınız.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
