import * as z from 'zod';

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'E-posta adresi gereklidir',
    })
    .email({
      message: 'Geçerli bir e-posta adresi giriniz',
    }),
  password: z
    .string({
      required_error: 'Şifre gereklidir',
    })
    .min(6, {
      message: 'Şifre en az 6 karakter olmalıdır',
    }),
});

export default loginSchema;
