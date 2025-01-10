// queries/useAuth.js
import { signIn } from 'next-auth/react';

import { registerUser } from '@/features/auth/services/auth';

import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const result = await signIn('credentials', {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
