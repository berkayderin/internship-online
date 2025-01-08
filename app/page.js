'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	ClipboardList,
	Calendar,
	Users2,
	CheckCircle
} from 'lucide-react'

export default function HomePage() {
	const router = useRouter()

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
			{/* Hero Section */}
			<div className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden">
				<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
				<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm" />
				<div className="relative text-center space-y-6 max-w-4xl px-4 animate-fade-in">
					<h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
						Staj Takip Sistemi
					</h1>
					<p className="text-muted-foreground text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed">
						Staj sürecinizi kolayca yönetin, günlük aktivitelerinizi
						kaydedin ve geri bildirimlerinizi takip edin.
					</p>
					<div className="flex gap-6 justify-center pt-6">
						<Button 
							size="lg" 
							onClick={() => router.push('/login')}
							className="text-lg px-8 py-6 hover:scale-105 transition-transform"
						>
							Giriş Yap
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={() => router.push('/register')}
							className="text-lg px-8 py-6 hover:scale-105 transition-transform"
						>
							Kayıt Ol
						</Button>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="container mx-auto py-24 px-4">
				<h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
					Özellikler
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="group flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
						<div className="bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform">
							<ClipboardList className="h-7 w-7 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">Staj Başvurusu</h3>
						<p className="text-muted-foreground">
							Online staj başvurusu yapın ve başvuru durumunuzu takip
							edin
						</p>
					</div>

					<div className="group flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
						<div className="bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform">
							<Calendar className="h-7 w-7 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">Günlük Aktiviteler</h3>
						<p className="text-muted-foreground">
							Staj günlüğünüzü dijital ortamda tutun ve geri bildirim
							alın
						</p>
					</div>

					<div className="group flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
						<div className="bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform">
							<Users2 className="h-7 w-7 text-primary" />
						</div>
						<h3 className="text-xl font-semibold">Öğrenci Takibi</h3>
						<p className="text-muted-foreground">
							Öğrencilerin staj süreçlerini ve aktivitelerini kolayca
							yönetin
						</p>
					</div>

					<div className="group flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg">
						<div className="bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform">
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
	)
}
