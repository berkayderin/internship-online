import * as z from 'zod';

const registerSchema = z.object({
  firstName: z
    .string({
      required_error: 'Ad gereklidir',
    })
    .min(2, {
      message: 'Ad en az 2 karakter olmalıdır',
    }),
  lastName: z
    .string({
      required_error: 'Soyad gereklidir',
    })
    .min(2, {
      message: 'Soyad en az 2 karakter olmalıdır',
    }),
  department: z
    .string({
      required_error: 'Bölüm seçiniz',
    })
    .min(1, {
      message: 'Bölüm seçiniz',
    })
    .refine((val) => val && val.trim().length > 0, {
      message: 'Bölüm seçiniz',
    }),
  email: z
    .string({
      required_error: 'E-posta adresi gereklidir',
    })
    .email({
      message: 'Geçerli bir e-posta adresi giriniz',
    })
    .refine((email) => email.endsWith('@ogr.mehmetakif.edu.tr') || email.endsWith('@mehmetakif.edu.tr'), {
      message: 'Sadece Mehmet Akif Ersoy Üniversitesi mail adresleri kabul edilmektedir',
    }),
  password: z
    .string({
      required_error: 'Şifre gereklidir',
    })
    .min(6, {
      message: 'Şifre en az 6 karakter olmalıdır',
    }),
});

export default registerSchema;
