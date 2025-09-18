import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { FeaturesSection } from "@/components/features-section"
import { WhatsAppCTA } from "@/components/whatsapp-cta"
import { CountdownSection } from "@/components/countdown-section"
import { NotifySection } from "@/components/notify-section"
import { YouTubeSection } from "@/components/youtube-section"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { PageLoader } from "@/components/page-loader"

export default function Home() {
  return (
    <>
      <PageLoader />
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <WhatsAppCTA />
        <CountdownSection />
        <NotifySection />
        <YouTubeSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
