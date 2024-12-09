// features/daily-activities/components/ActivityForm.jsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	format,
	startOfWeek,
	endOfWeek,
	isWithinInterval,
	isSameWeek
} from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Form,
	FormControl,
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
import { Textarea } from '@/components/ui/textarea'
import dailyActivitySchema from '../zod/DailyActivitySchema'

export function ActivityForm({
	defaultValues,
	onSubmit,
	isSubmitting
}) {
	const today = new Date()
	const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
	const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 })

	const form = useForm({
		resolver: zodResolver(dailyActivitySchema),
		defaultValues: {
			date: defaultValues?.date
				? new Date(defaultValues.date)
				: today,
			content: defaultValues?.content || ''
		}
	})

	const handleMonthChange = (month) => {
		if (!isSameWeek(month, today, { weekStartsOn: 1 })) {
			return false
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
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tarih</FormLabel>
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
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => {
											return !isWithinInterval(date, {
												start: currentWeekStart,
												end: currentWeekEnd
											})
										}}
										defaultMonth={currentWeekStart}
										fromDate={currentWeekStart}
										toDate={currentWeekEnd}
										onMonthChange={handleMonthChange}
										fixedWeeks
										showOutsideDays={false}
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
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Aktivite İçeriği</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Bugün yaptığınız çalışmaları detaylı bir şekilde yazınız..."
									className="min-h-[200px]"
									{...field}
								/>
							</FormControl>
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
