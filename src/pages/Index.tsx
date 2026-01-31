import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PrivacySection } from "@/components/home/PrivacySection";
import { FAQSection } from "@/components/home/FAQSection";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Laptop Checker Online Free | #1 Hardware Test Tool 2026"
        description="Best free laptop checker online! Test display dead pixels, keyboard keys, webcam, microphone & speakers instantly. #1 laptop diagnostic tool - no download needed."
        keywords="laptop checker, laptop checker online, laptop checker free, free laptop checker, laptop test online, laptop tester, laptop diagnostic tool, dead pixel test, keyboard tester, webcam test, mic test, speaker test"
        canonicalPath="/"
      />
      <Header />
      <main id="main-content" role="main" aria-label="Laptop Checker Home">
        <HeroSection />
        <FeaturesSection />
        <PrivacySection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
