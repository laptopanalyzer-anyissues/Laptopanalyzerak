import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Laptop, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Target, 
  Heart,
  CheckCircle,
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Volume2,
  Wifi,
  Usb,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const features = [
  { icon: Monitor, label: "Display Test" },
  { icon: Keyboard, label: "Keyboard Test" },
  { icon: Camera, label: "Camera Test" },
  { icon: Mic, label: "Microphone Test" },
  { icon: Volume2, label: "Audio Test" },
  { icon: Wifi, label: "Network Test" },
  { icon: Usb, label: "Ports Test" },
  { icon: MousePointer, label: "Touchpad Test" },
];

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data never leaves your device. All tests run locally in your browser with zero server-side processing.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Comprehensive diagnostics in minutes. No downloads, installations, or lengthy processes required.",
  },
  {
    icon: Globe,
    title: "Accessible to All",
    description: "Free for everyone, everywhere. No accounts, subscriptions, or hidden fees. Just open and test.",
  },
  {
    icon: Heart,
    title: "User-Focused",
    description: "Designed for real people, not just tech experts. Clear results and actionable insights for everyone.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About LaptopAnalyzer - Free Laptop Diagnostic Tool"
        description="Learn about LaptopAnalyzer, the free browser-based laptop diagnostic tool. Test your laptop hardware with complete privacy - no downloads, no data collection."
        keywords="about laptopanalyzer, laptop diagnostic tool, free hardware test, laptop testing website, about us"
        canonicalPath="/about"
      />
      <Header />
      <main className="pt-24 pb-16" role="main" aria-label="About LaptopAnalyzer">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Laptop className="h-4 w-4" />
              About LaptopAnalyzer
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Empowering Users to Understand Their Hardware
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              LaptopAnalyzer is a free, browser-based diagnostic platform that helps you verify every component of your laptop works correctly—without compromising your privacy.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We believe everyone deserves access to professional-grade hardware diagnostics. Whether you are buying a used laptop, troubleshooting an issue, or simply curious about your device's health, LaptopAnalyzer provides the tools you need—completely free and without any data collection.
              </p>
            </div>
          </motion.section>

          {/* What We Test Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Comprehensive Hardware Testing
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Our diagnostic suite covers all major laptop components, giving you a complete picture of your device's health.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* How It Works Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              How LaptopAnalyzer Works
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { step: "1", title: "Open Your Browser", description: "No downloads or installations needed. Just visit our website on any modern browser." },
                { step: "2", title: "Select a Test", description: "Choose from our comprehensive suite of hardware diagnostics or run all tests at once." },
                { step: "3", title: "Grant Permissions", description: "For certain tests, we will ask for browser permissions. These are only used locally." },
                { step: "4", title: "Get Results", description: "Receive instant, clear results about your hardware's functionality and health." },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Why Choose Us Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-20"
          >
            <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Why Choose LaptopAnalyzer?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "100% free with no hidden costs",
                  "No account or registration required",
                  "Works on all major browsers",
                  "Complete privacy - no data collection",
                  "Instant results with clear explanations",
                  "Professional-grade diagnostic accuracy",
                  "Regular updates and new tests",
                  "Mobile-friendly interface",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Test Your Laptop?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start running diagnostics on your laptop in seconds. No downloads, no sign-ups, just instant results.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                <Laptop className="h-5 w-5 mr-2" />
                Start Testing Now
              </Link>
            </Button>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;