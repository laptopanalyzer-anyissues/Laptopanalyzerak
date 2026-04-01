import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Play,
  Monitor,
  Keyboard,
  Mic,
  Speaker,
  Camera,
  Wifi,
  Usb,
  MousePointer2,
  CheckCircle,
} from "lucide-react";

const testIcons = [
  { Icon: Monitor, label: "Display" },
  { Icon: Keyboard, label: "Keyboard" },
  { Icon: Speaker, label: "Audio" },
  { Icon: Mic, label: "Microphone" },
  { Icon: Camera, label: "Camera" },
  { Icon: Wifi, label: "Network" },
  { Icon: Usb, label: "Ports" },
  { Icon: MousePointer2, label: "Touchpad" },
];

export function HeroSection() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % testIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = testIcons[currentIconIndex].Icon;
  const currentLabel = testIcons[currentIconIndex].label;

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16"
      aria-labelledby="hero-heading"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>Free • No Signup • Browser-Based</span>
            </motion.div>

            {/* Headline — preserving SEO H1 text */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
            >
              Test Your Laptop Hardware{" "}
              <span className="gradient-text">Instantly</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Check your display, keyboard, camera, microphone, and speakers
              — directly in your browser.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  <Play className="h-5 w-5" />
                  Start Full Test
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-border/60 hover:border-primary/40"
              >
                <Link to="/dashboard">
                  <span>View All Tests</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-5 justify-center lg:justify-start"
            >
              {[
                { Icon: Shield, text: "Runs locally in your browser" },
                { Icon: Zap, text: "Results in seconds" },
                { Icon: Globe, text: "Works on any OS" },
              ].map(({ Icon, text }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-success" aria-hidden="true" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Interactive laptop illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto w-full max-w-md lg:max-w-lg"
          >
            {/* Glow behind laptop */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] scale-75" />

            {/* Laptop frame */}
            <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-card to-muted border border-border shadow-2xl animate-glow">
              <div className="aspect-video bg-gradient-to-br from-primary/15 to-accent/15 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIconIndex}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-3"
                  >
                    <CurrentIcon className="h-16 w-16 md:h-20 md:w-20 text-primary" />
                    <span className="text-sm font-medium text-primary/80">
                      {currentLabel} Test
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Trackpad line */}
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-24 rounded-full bg-muted-foreground/20" />
              </div>
              {/* Progress dots */}
              <div className="mt-3 flex justify-center gap-1.5">
                {testIcons.map((_, index) => (
                  <motion.div
                    key={index}
                    className="h-1.5 rounded-full bg-muted-foreground/30 transition-all duration-300"
                    animate={{
                      width: index === currentIconIndex ? 16 : 6,
                      backgroundColor:
                        index === currentIconIndex
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground) / 0.3)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -left-4 top-1/4 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-lg"
            >
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-foreground">8 Tests</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -right-4 bottom-1/3 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-lg"
            >
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Private</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
