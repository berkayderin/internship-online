// features/internship-periods/zod/InternshipPeriodSchema.js
import * as z from 'zod';

const internshipPeriodSchema = z
  .object({
    name: z
      .string({
        required_error: 'Staj dönemi adı zorunludur',
      })
      .min(3, 'Staj dönemi adı en az 3 karakter olmalıdır'),
    startDate: z.coerce.date({
      required_error: 'Başvuru başlangıç tarihi zorunludur',
    }),
    endDate: z.coerce.date({
      required_error: 'Başvuru bitiş tarihi zorunludur',
    }),
    internshipStartDate: z.coerce.date({
      required_error: 'Staj başlangıç tarihi zorunludur',
    }),
    internshipEndDate: z.coerce.date({
      required_error: 'Staj bitiş tarihi zorunludur',
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'Başvuru bitiş tarihi başlangıç tarihinden sonra olmalıdır',
    path: ['endDate'],
  })
  .refine((data) => data.internshipEndDate > data.internshipStartDate, {
    message: 'Staj bitiş tarihi başlangıç tarihinden sonra olmalıdır',
    path: ['internshipEndDate'],
  })
  .refine((data) => data.internshipStartDate > data.endDate, {
    message: 'Staj başlangıç tarihi başvuru bitiş tarihinden sonra olmalıdır',
    path: ['internshipStartDate'],
  });

export default internshipPeriodSchema;
