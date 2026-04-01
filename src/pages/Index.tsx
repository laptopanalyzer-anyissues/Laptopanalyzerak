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
    <div className="min-h-screen bg-background relative">
      {/* Unified premium background — extends hero visual across entire homepage */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Continuous subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Top-left ambient glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/8 dark:bg-primary/10 rounded-full blur-[120px]" />
        {/* Mid-right ambient glow */}
        <div className="absolute top-[40%] -right-32 w-[500px] h-[500px] bg-accent/6 dark:bg-accent/8 rounded-full blur-[100px]" />
        {/* Bottom-center ambient glow */}
        <div className="absolute bottom-[10%] left-1/3 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/7 rounded-full blur-[100px]" />
      </div>
      <SEOHead
        title="Laptop Analyzer – Test & Check Your Laptop Hardware Online (Free)"
        description="Run a complete laptop test online to check your screen, speakers, mic, and keyboard. The easiest way to test a laptop is without downloading software. Free & instant."
        keywords="laptop analyzer, laptop checker, laptop checker online, laptop test online, test laptop online, check laptop hardware, laptop hardware test, free laptop checker, laptop diagnostic tool, dead pixel test, keyboard tester, webcam test, mic test, speaker test"
        canonicalPath="/"
      />
      <Header />
      <main id="main-content" role="main" aria-label="Laptop Checker Home" className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <WhySection />
        <HowItWorksSection />
        <SEOContentSection />
        <LatestArticlesSection />
        <PrivacySection />
        <FinalCTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
