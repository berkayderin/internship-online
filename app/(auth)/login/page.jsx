'use client';

import { useRouter } from 'next/navigation';

import { AuthForm } from '@/features/auth/components/AuthForm';
import { useLogin } from '@/features/auth/queries/useAuth';
import loginSchema from '@/features/auth/zod/LoginSchema';

import { toast } from '@/hooks/use-toast';

const LoginPage = () => {
  const router = useRouter();
  const login = useLogin();

  const handleLogin = async (data) => {
    try {
      await login.mutateAsync(data);
      toast({
        title: 'Giriş başarılı',
        description: 'Panel sayfasına yönlendiriliyorsunuz.',
      });
      router.push('/panel');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Giriş yapılamadı. Bilgilerinizi kontrol edin.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-4 top-0 h-96 w-96 rounded-full bg-primary/30 opacity-20 mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-2000 absolute -right-4 top-0 h-96 w-96 rounded-full bg-purple-500/30 opacity-20 mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-96 w-96 rounded-full bg-pink-500/30 opacity-20 mix-blend-multiply blur-3xl filter" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />

        <div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_20%,#000_100%)]" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[520px]">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-background/50 backdrop-blur-xl" />
        <div className="relative space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-3xl font-bold text-transparent">
              Giriş Yap
            </h1>
            <p className="text-muted-foreground">Staj takip sistemine hoş geldiniz</p>
          </div>

          <AuthForm type="login" onSubmit={handleLogin} isSubmitting={login.isLoading} schema={loginSchema} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
