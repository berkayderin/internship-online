import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { DatePickerField } from '@/components/form/DatePickerField'
import { useUpdatePublicHoliday } from '../queries/usePublicHoliday'
import publicHolidaySchema from '../zod/PublicHolidaySchema'

export function PublicHolidayDialog({
	mode,
	holiday,
	open,
	onOpenChange
}) {
	const { mutate, isPending } = useUpdatePublicHoliday()

	const form = useForm({
		resolver: zodResolver(publicHolidaySchema),
		defaultValues: {
			type: holiday.type,
			startDate: new Date(holiday.startDate),
			endDate: new Date(holiday.endDate)
		}
	})

	const onSubmit = (values) => {
		mutate(
			{ id: holiday.id, ...values },
			{
				onSuccess: () => {
					onOpenChange(false)
					form.reset()
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Resmi Tatil Düzenle</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<DatePickerField
							control={form.control}
							name="startDate"
							label="Başlangıç Tarihi"
						/>
						<DatePickerField
							control={form.control}
							name="endDate"
							label="Bitiş Tarihi"
						/>
						<div className="flex justify-end">
							<Button type="submit" disabled={isPending}>
								{isPending ? 'Kaydediliyor...' : 'Kaydet'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
