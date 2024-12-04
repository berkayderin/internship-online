'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import internshipPeriodSchema from '../zod/InternshipPeriodSchema'
import { useUpdateInternshipPeriod } from '../queries/useInternshipPeriod'

export function EditPeriodDialog({ open, onOpenChange, period }) {
	const form = useForm({
		resolver: zodResolver(internshipPeriodSchema),
		defaultValues: {
			name: period.name,
			startDate: new Date(period.startDate),
			endDate: new Date(period.endDate),
			internshipStartDate: new Date(period.internshipStartDate),
			internshipEndDate: new Date(period.internshipEndDate)
		}
	})

	const updatePeriod = useUpdateInternshipPeriod()

	const onSubmit = async (data) => {
		await updatePeriod.mutateAsync({
			id: period.id,
			data
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Staj Dönemini Düzenle</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						{/* Form alanları CreatePeriodDialog ile aynı */}
						<Button type="submit" disabled={updatePeriod.isLoading}>
							{updatePeriod.isLoading
								? 'Güncelleniyor...'
								: 'Güncelle'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
