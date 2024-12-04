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
		<div className="min-h-screen">
			{/* Hero Section */}
			<div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-background to-muted px-4">
				<div className="text-center space-y-4 max-w-3xl">
					<h1 className="text-4xl sm:text-5xl font-bold">
						Staj Takip Sistemi
					</h1>
					<p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
						Staj sürecinizi kolayca yönetin, günlük aktivitelerinizi
						kaydedin ve geri bildirimlerinizi takip edin.
					</p>
					<div className="flex gap-4 justify-center pt-4">
						<Button size="lg" onClick={() => router.push('/login')}>
							Giriş Yap
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={() => router.push('/register')}
						>
							Kayıt Ol
						</Button>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="container mx-auto py-16 px-4">
				<h2 className="text-3xl font-bold text-center mb-12">
					Özellikler
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="flex flex-col items-center text-center space-y-4 p-6">
						<div className="bg-primary/10 p-3 rounded-full">
							<ClipboardList className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Staj Başvurusu</h3>
						<p className="text-muted-foreground">
							Online staj başvurusu yapın ve başvuru durumunuzu takip
							edin
						</p>
					</div>

					<div className="flex flex-col items-center text-center space-y-4 p-6">
						<div className="bg-primary/10 p-3 rounded-full">
							<Calendar className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Günlük Aktiviteler</h3>
						<p className="text-muted-foreground">
							Staj günlüğünüzü dijital ortamda tutun ve geri bildirim
							alın
						</p>
					</div>

					<div className="flex flex-col items-center text-center space-y-4 p-6">
						<div className="bg-primary/10 p-3 rounded-full">
							<Users2 className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Öğrenci Takibi</h3>
						<p className="text-muted-foreground">
							Öğrencilerin staj süreçlerini ve aktivitelerini kolayca
							yönetin
						</p>
					</div>

					<div className="flex flex-col items-center text-center space-y-4 p-6">
						<div className="bg-primary/10 p-3 rounded-full">
							<CheckCircle className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Kolay Onay Süreci</h3>
						<p className="text-muted-foreground">
							Başvuru ve aktivite onaylarını hızlıca gerçekleştirin
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
