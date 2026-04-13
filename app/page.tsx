import Header from "@/components/academy/Header"
import HeroSection from "@/components/academy/HeroSection"
import FeaturesSection from "@/components/academy/FeaturesSection"
import GallerySection from "@/components/academy/GallerySection"
import LocationSection from "@/components/academy/LocationSection"
import ContactSection from "@/components/academy/ContactSection"
import Footer from "@/components/academy/Footer"
import KakaoFAB from "@/components/academy/KakaoFAB"

export default function Page() {
  return (
    <main className="min-h-screen max-w-md mx-auto relative">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <GallerySection />
      <LocationSection />
      <ContactSection />
      <Footer />
      <KakaoFAB />
    </main>
  )
}
