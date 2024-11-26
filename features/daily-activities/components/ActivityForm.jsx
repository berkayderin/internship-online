// features/daily-activities/components/ActivityForm.jsx
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
			const formData = {
				...values,
				date: new Date(values.date)
			}
			await onSubmit(formData)
		} catch (error) {
			console.error('Form submission error:', error)
		}
	}

	const now = new Date()
	const threeDaysAgo = new Date(now)
	threeDaysAgo.setDate(now.getDate() - 3)
	const threeDaysLater = new Date(now)
	threeDaysLater.setDate(now.getDate() + 3)

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4"
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
											date < threeDaysAgo || date > threeDaysLater
										}
										initialFocus
										locale={tr}
									/>
								</PopoverContent>
							</Popover>
							<FormDescription>
								Aktivite tarihi en fazla 3 gün öncesi veya 3 gün
								sonrası için seçilebilir.
							</FormDescription>
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
						{isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
