import Credentials from 'next-auth/providers/credentials';

import { compare } from 'bcryptjs';

import loginSchema from './features/auth/zod/LoginSchema';
import prisma from './lib/prisma';

const config = {
  providers: [
    Credentials({
      name: 'credentials',
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);

        if (validated.success) {
          const { email, password } = validated.data;

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              department: true,
              role: true,
              passwordHash: true,
            },
          });

          if (!user || !(await compare(password, user.passwordHash))) {
            return null;
          }

          const { passwordHash, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.department = token.department;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  secret: process.env.AUTH_SECRET,
};

export default config;
