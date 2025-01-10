import { z } from 'zod';

const baseSchema = {
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır').max(50, 'Ad en fazla 50 karakter olabilir'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').max(50, 'Soyad en fazla 50 karakter olabilir'),
  department: z.string().min(2, 'Bölüm en az 2 karakter olmalıdır').max(100, 'Bölüm en fazla 100 karakter olabilir'),
};

export const createAdminSchema = z.object({
  ...baseSchema,
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(100, 'Şifre en fazla 100 karakter olabilir'),
});

export const updateAdminSchema = z.object({
  ...baseSchema,
});
