import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { WhySection } from "@/components/home/WhySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SEOContentSection } from "@/components/home/SEOContentSection";
import { LatestArticlesSection } from "@/components/home/LatestArticlesSection";
import { PrivacySection } from "@/components/home/PrivacySection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import { FAQSection } from "@/components/home/FAQSection";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Laptop Analyzer – Test & Check Your Laptop Hardware Online (Free)"
        description="Run a complete laptop test online to check your screen, speakers, mic, and keyboard. The easiest way to test a laptop is without downloading software. Free & instant."
        keywords="laptop analyzer, laptop checker, laptop checker online, laptop test online, test laptop online, check laptop hardware, laptop hardware test, free laptop checker, laptop diagnostic tool, dead pixel test, keyboard tester, webcam test, mic test, speaker test"
        canonicalPath="/"
      />
      <Header />
      <main id="main-content" role="main" aria-label="Laptop Checker Home">
        {/* Grid section (1) — Hero */}
        <div className="homepage-grid-section homepage-grid-section-first">
          <HeroSection />
        </div>
        {/* Clean section (2) */}
        <FeaturesSection />
        {/* Grid section (3) */}
        <div className="homepage-grid-section">
          <WhySection />
        </div>
        {/* Clean section (4) */}
        <HowItWorksSection />
        {/* Grid section (5) */}
        <div className="homepage-grid-section">
          <SEOContentSection />
        </div>
        {/* Clean section (6) */}
        <LatestArticlesSection />
        {/* Grid section (7) */}
        <div className="homepage-grid-section">
          <PrivacySection />
        </div>
        {/* Clean section (8) */}
        <FinalCTASection />
        {/* Grid section (9) — Last */}
        <div className="homepage-grid-section homepage-grid-section-last">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
