'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	ClipboardList,
	Calendar,
	Users2,
	CheckCircle,
	ArrowRight
} from 'lucide-react'

export default function HomePage() {
	const router = useRouter()

	return (
		<div className="min-h-screen bg-background relative overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
				<div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
				<div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
				
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-[0.02]" />
				
				<div className="absolute inset-0 bg-background/80 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_20%,#000_100%)]" />
			</div>

			<div className="relative flex flex-col items-center justify-center min-h-[90vh]">
				<div className="text-center space-y-8 max-w-4xl px-4 animate-fade-in">
					<div className="space-y-4">
						<h1 className="text-6xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70 animate-gradient pb-2">
							Staj Takip Sistemi
						</h1>
						<p className="text-muted-foreground text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed">
							Staj sürecinizi kolayca yönetin, günlük aktivitelerinizi
							kaydedin ve geri bildirimlerinizi takip edin.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-8">
						<Button 
							size="lg"
							onClick={() => router.push('/login')}
							className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
							<span className="relative">
								Giriş Yap
								<ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
							</span>
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={() => router.push('/register')}
							className="text-lg px-8 py-6 border-2 hover:bg-primary/5 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
							<span className="relative">Kayıt Ol</span>
						</Button>
					</div>
				</div>
			</div>

			<div className="relative container mx-auto py-24 px-4">
				<div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
				<div className="relative">
					<h2 className="text-4xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
						Özellikler
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="group relative p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative space-y-4">
								<div className="bg-primary/10 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform duration-500">
									<ClipboardList className="h-7 w-7 text-primary" />
								</div>
								<h3 className="text-xl font-semibold">Staj Başvurusu</h3>
								<p className="text-muted-foreground">
									Online staj başvurusu yapın ve başvuru durumunuzu takip
									edin
								</p>
							</div>
						</div>

						<div className="group relative p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative space-y-4">
								<div className="bg-primary/10 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform duration-500">
									<Calendar className="h-7 w-7 text-primary" />
								</div>
								<h3 className="text-xl font-semibold">Günlük Aktiviteler</h3>
								<p className="text-muted-foreground">
									Staj günlüğünüzü dijital ortamda tutun ve geri bildirim
									alın
								</p>
							</div>
						</div>

						<div className="group relative p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative space-y-4">
								<div className="bg-primary/10 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform duration-500">
									<Users2 className="h-7 w-7 text-primary" />
								</div>
								<h3 className="text-xl font-semibold">Öğrenci Takibi</h3>
								<p className="text-muted-foreground">
									Öğrencilerin staj süreçlerini ve aktivitelerini kolayca
									yönetin
								</p>
							</div>
						</div>

						<div className="group relative p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative space-y-4">
								<div className="bg-primary/10 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform duration-500">
									<CheckCircle className="h-7 w-7 text-primary" />
								</div>
								<h3 className="text-xl font-semibold">Kolay Onay Süreci</h3>
								<p className="text-muted-foreground">
									Başvuru ve aktivite onaylarını hızlıca gerçekleştirin
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx global>{`
				@keyframes blob {
					0% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
					100% { transform: translate(0px, 0px) scale(1); }
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
	)
}
