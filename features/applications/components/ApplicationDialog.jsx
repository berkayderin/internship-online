// features/applications/components/ApplicationDialog.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

import { toast } from '@/hooks/use-toast';

import { cn } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { useCreateApplication, useInternshipPeriod, usePublicHolidays } from '../queries/useApplication';
import applicationSchema from '../zod/ApplicationSchema';

// İş günü hesaplama fonksiyonu
const calculateWorkingDays = (startDate, endDate, workingSaturday, holidays) => {
  let totalDays = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Hafta sonu kontrolü
    const isSaturday = currentDate.getDay() === 6;
    const isSunday = currentDate.getDay() === 0;

    // Resmi tatil kontrolü
    const isHoliday = holidays.some((holiday) =>
      isWithinInterval(currentDate, {
        start: new Date(holiday.startDate),
        end: new Date(holiday.endDate),
      })
    );

    if (!isSunday && !isHoliday && (!isSaturday || workingSaturday)) {
      totalDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalDays;
};

export function ApplicationDialog({ open, onOpenChange, periodId, initialData, mode, onSubmit }) {
  const { data: period } = useInternshipPeriod(periodId);
  const createApplication = useCreateApplication();
  const [workingDays, setWorkingDays] = useState(0);

  const { data: holidays } = usePublicHolidays();

  const form = useForm({
    resolver: zodResolver(applicationSchema, {
      contextualData: {
        period: period,
      },
    }),
    defaultValues: initialData
      ? {
          ...initialData,
          internshipStartDate: initialData.internshipStartDate ? new Date(initialData.internshipStartDate) : '',
          internshipEndDate: initialData.internshipEndDate ? new Date(initialData.internshipEndDate) : '',
        }
      : {
          periodId: '',
          companyName: '',
          companyPhone: '',
          companyWebsite: '',
          companyAddress: '',
          companyEmployeeCount: '',
          internshipStartDate: '',
          internshipEndDate: '',
        },
  });

  useEffect(() => {
    if (periodId) {
      form.setValue('periodId', periodId);
    }
  }, [periodId, form]);

  const startDate = form.watch('internshipStartDate');
  const endDate = form.watch('internshipEndDate');
  const workingSaturday = form.watch('workingSaturday');

  useEffect(() => {
    if (startDate && endDate && holidays) {
      const days = calculateWorkingDays(startDate, endDate, workingSaturday, holidays);
      setWorkingDays(days);
    }
  }, [startDate, endDate, workingSaturday, holidays]);

  const handleFormSubmit = async (data) => {
    if (workingDays !== 30 && workingDays !== 70) {
      toast({
        title: 'Hata',
        description: 'Staj süresi sadece 30 veya 70 iş günü olabilir.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formattedData = {
        ...data,
        periodId: periodId,
        internshipStartDate: new Date(data.internshipStartDate).toISOString(),
        internshipEndDate: new Date(data.internshipEndDate).toISOString(),
      };

      if (mode === 'edit') {
        await onSubmit(formattedData);
      } else {
        await createApplication.mutateAsync(formattedData);
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Başvuru Düzenle' : 'Staj Başvurusu'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                  <FormItem className="flex-1">
                    <FormLabel>İşyeri Telefonu</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İşyeri Web Adresi (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} placeholder="https://example.com" />
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

            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="workingSaturday"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl className="mt-2">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Şirket cumartesi günleri çalışıyor mu?</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="internshipStartDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Staj Başlangıç Tarihi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', {
                                locale: tr,
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
                          disabled={(date) => date < new Date(period?.internshipStartDate) || date > new Date(period?.internshipEndDate)}
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
                    <FormLabel>Staj Bitiş Tarihi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', {
                                locale: tr,
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
                          disabled={(date) => date < new Date(period?.internshipStartDate) || date > new Date(period?.internshipEndDate)}
                          locale={tr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {workingDays > 0 && (
              <div className="space-y-2 rounded-lg border border-secondary bg-secondary/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Seçilen Toplam İş Günü</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold">{workingDays}</span>
                      <span className="text-sm text-muted-foreground">gün</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {workingDays !== 30 && workingDays !== 70 && (
                      <div className="mt-2 flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">Staj süresi sadece 30 veya 70 iş günü olabilir</p>
                      </div>
                    )}

                    {(workingDays === 30 || workingDays === 70) && (
                      <div className="mt-2 flex items-center gap-2 rounded-md bg-green-500/10 p-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <p className="text-sm font-medium">Seçilen staj süresi uygun</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="companyEmployeeCount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Toplam Çalışan Sayısı</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyEngineerCount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Toplam Mühendis Sayısı</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={createApplication.isLoading}>
                {createApplication.isLoading ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
