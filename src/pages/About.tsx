import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Laptop,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Volume2,
  Wifi,
  Usb,
  MousePointer,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const tests = [
  { icon: Monitor, label: "Display" },
  { icon: Keyboard, label: "Keyboard" },
  { icon: Camera, label: "Camera" },
  { icon: Mic, label: "Microphone" },
  { icon: Volume2, label: "Audio" },
  { icon: Wifi, label: "Network" },
  { icon: Usb, label: "Ports" },
  { icon: MousePointer, label: "Touchpad" },
];

const values = [
  {
    icon: Shield,
    title: "Privacy-Conscious",
    desc: "Core diagnostics run locally in your browser. We're built to minimize unnecessary data handling.",
  },
  {
    icon: Zap,
    title: "Instant & Lightweight",
    desc: "No downloads or installations. Open the site, pick a test, and get results in seconds.",
  },
  {
    icon: Globe,
    title: "Free & Accessible",
    desc: "No sign-ups, no subscriptions. Professional-grade diagnostics available to everyone.",
  },
];

const steps = [
  { n: "1", title: "Open the website", desc: "Works on any modern browser — no setup needed." },
  { n: "2", title: "Choose a test", desc: "Pick a specific component or run the full suite." },
  { n: "3", title: "Allow permissions", desc: "Some tests need camera or mic access — requested only when needed." },
  { n: "4", title: "Review results", desc: "Get clear, instant feedback on your hardware." },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="About LaptopAnalyzer - Browser-Based Laptop Diagnostics"
      description="Laptop Analyzer is a free, browser-based diagnostic platform for testing laptop hardware — display, keyboard, camera, mic, audio, network, ports, and touchpad."
      keywords="about laptopanalyzer, laptop diagnostic tool, free hardware test, browser laptop test"
      canonicalPath="/about"
    />
    <Header />

    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* ═══ Hero ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 200, damping: 14 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6"
            style={{ boxShadow: "0 10px 32px -8px hsl(var(--primary) / 0.35)" }}
          >
            <Laptop className="h-6 w-6 text-primary-foreground" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Diagnostics That Run Where You Do
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Laptop Analyzer is a free, browser-based platform that lets you verify your laptop's hardware — from display and keyboard to camera and network — without installing anything.
          </p>
        </motion.section>

        {/* ═══ Mission ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-20"
        >
          <div className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-accent/[0.03] border border-border p-8 md:p-10 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.04] pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
            />
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Why We Built This</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Professional hardware diagnostics shouldn't require expensive software or technical expertise. Whether you're buying a used laptop, troubleshooting an issue, or just curious — Laptop Analyzer gives you the tools to check every component, right from your browser.
            </p>
          </div>
        </motion.section>

        {/* ═══ What We Test ═══ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-20"
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3"
          >
            8 Hardware Tests, One Platform
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            A complete diagnostic suite covering every major laptop component.
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tests.map((t) => (
              <motion.div
                key={t.label}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.03 }}
                className="flex flex-col items-center gap-2.5 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group cursor-default"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{t.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ Values ═══ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-20"
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            What We Stand For
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10 inline-flex mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ How It Works ═══ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-20"
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {steps.map((s) => (
              <motion.div
                key={s.n}
                variants={fadeUp}
                className="flex items-start gap-3.5 p-5 rounded-xl bg-card border border-border"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-0.5">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ Why Choose ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-20"
        >
          <div className="rounded-2xl bg-card border border-border p-8">
            <h2 className="text-xl font-bold text-foreground mb-5 text-center">Why Laptop Analyzer?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl mx-auto">
              {[
                "Free — no hidden costs or upsells",
                "No account or registration needed",
                "Works on all major browsers",
                "Privacy-conscious, browser-first design",
                "Clear results with actionable feedback",
                "Continuously updated with new tests",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══ CTA ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to Check Your Hardware?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Run a full diagnostic in your browser — no downloads, no sign-ups.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard" className="inline-flex items-center gap-2">
                Start Testing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </main>

    <Footer />
  </div>
);

export default About;
