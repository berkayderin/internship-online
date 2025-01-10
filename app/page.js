'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ArrowRight, Calendar, CheckCircle, ClipboardList, Users2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-4 top-0 h-96 w-96 rounded-full bg-primary/30 opacity-20 mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-2000 absolute -right-4 top-0 h-96 w-96 rounded-full bg-purple-500/30 opacity-20 mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-96 w-96 rounded-full bg-pink-500/30 opacity-20 mix-blend-multiply blur-3xl filter" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.02] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />

        <div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_20%,#000_100%)]" />
      </div>

      <div className="relative flex min-h-[90vh] flex-col items-center justify-center">
        <div className="max-w-4xl animate-fade-in space-y-8 px-4 text-center">
          <div className="space-y-4">
            <h1 className="animate-gradient bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text pb-2 text-6xl font-bold text-transparent sm:text-7xl">
              Staj Takip Sistemi
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Staj sürecinizi kolayca yönetin, günlük aktivitelerinizi kaydedin ve geri bildirimlerinizi takip edin.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row sm:gap-6">
            <Link href="/login">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/20"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                <span className="relative">
                  Giriş Yap
                  <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden border-2 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:bg-primary/5"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                <span className="relative">Kayıt Ol</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <div className="relative">
          <h2 className="mb-20 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-center text-4xl font-bold text-transparent">
            Özellikler
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="w-fit rounded-xl bg-primary/10 p-4 transition-transform duration-500 group-hover:scale-110">
                  <ClipboardList className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Staj Başvurusu</h3>
                <p className="text-muted-foreground">Online staj başvurusu yapın ve başvuru durumunuzu takip edin</p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="w-fit rounded-xl bg-primary/10 p-4 transition-transform duration-500 group-hover:scale-110">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Günlük Aktiviteler</h3>
                <p className="text-muted-foreground">Staj günlüğünüzü dijital ortamda tutun ve geri bildirim alın</p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="w-fit rounded-xl bg-primary/10 p-4 transition-transform duration-500 group-hover:scale-110">
                  <Users2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Öğrenci Takibi</h3>
                <p className="text-muted-foreground">Öğrencilerin staj süreçlerini ve aktivitelerini kolayca yönetin</p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="w-fit rounded-xl bg-primary/10 p-4 transition-transform duration-500 group-hover:scale-110">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Kolay Onay Süreci</h3>
                <p className="text-muted-foreground">Başvuru ve aktivite onaylarını hızlıca gerçekleştirin</p>
              </div>
            </div>
          </div>
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
}
