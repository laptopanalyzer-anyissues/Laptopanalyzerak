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
import { SEOHead, structuredData } from "@/components/SEOHead";

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
  { icon: Shield, title: "Privacy-First", desc: "Diagnostics run in your browser. No data is collected or transmitted." },
  { icon: Zap, title: "Instant Results", desc: "No downloads, no setup. Pick a test and get feedback in seconds." },
  { icon: Globe, title: "Free for Everyone", desc: "No accounts, no paywalls. Professional-grade tools, zero friction." },
];

const steps = [
  { n: "1", title: "Open the site", desc: "Any modern browser — no installs." },
  { n: "2", title: "Pick a test", desc: "One component or the full suite." },
  { n: "3", title: "Grant access", desc: "Camera or mic — only when needed." },
  { n: "4", title: "Get results", desc: "Clear, instant hardware feedback." },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="About LaptopAnalyzer - Browser-Based Laptop Diagnostics"
      description="Laptop Analyzer is a free, browser-based platform for testing laptop hardware — display, keyboard, camera, mic, audio, network, ports, and touchpad."
      keywords="about laptopanalyzer, laptop diagnostic tool, free hardware test, browser laptop test"
      canonicalPath="/about"
      structuredData={structuredData.breadcrumbs([
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ])}
    />
    <Header />

    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-center mb-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 200, damping: 14 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6"
            style={{ boxShadow: "0 10px 32px -8px hsl(var(--primary) / 0.35)" }}
          >
            <Laptop className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Hardware Diagnostics,{" "}
            <span className="gradient-text">In Your Browser</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Verify every component of your laptop — display, keyboard, camera, audio, and more — without installing a thing.
          </p>
        </motion.section>

        {/* Mission */}
        <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-20">
          <div className="rounded-2xl bg-gradient-to-br from-primary/[0.04] to-accent/[0.03] border border-border p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
            <h2 className="text-xl font-bold text-foreground mb-2">Why We Built This</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Buying a used laptop? Troubleshooting a hardware issue? You shouldn't need expensive software to check if your screen, speakers, or webcam actually work. Laptop Analyzer puts professional diagnostics one click away.
            </p>
          </div>
        </motion.section>

        {/* Tests */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            8 Tests. One Platform.
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tests.map((t) => (
              <motion.div key={t.label} variants={fadeUp} whileHover={{ y: -4 }} className="flex flex-col items-center gap-2 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-default">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{t.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            What We Stand For
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((v) => (
              <motion.div key={v.title} variants={fadeUp} whileHover={{ y: -3 }} className="p-5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10 inline-flex mb-3">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            How It Works
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {steps.map((s) => (
              <motion.div key={s.n} variants={fadeUp} className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold mx-auto mb-3">
                  {s.n}
                </div>
                <h3 className="text-xs font-semibold text-foreground mb-0.5">{s.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-snug">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose */}
        <motion.section initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-20">
          <div className="rounded-2xl bg-card border border-border p-7">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">Why Laptop Analyzer?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-2xl mx-auto">
              {[
                "Completely free — no upsells",
                "No registration required",
                "Compatible with all major browsers",
                "Privacy-conscious, browser-first architecture",
                "Actionable results, not raw data dumps",
                "Actively maintained and regularly updated",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">See What Your Laptop Can Do</h2>
          <p className="text-sm text-muted-foreground mb-7">Full hardware diagnostics — right in your browser.</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard" className="inline-flex items-center gap-2">
                Start Testing <ArrowRight className="h-4 w-4" />
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
