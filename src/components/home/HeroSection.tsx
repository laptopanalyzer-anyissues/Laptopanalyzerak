import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe,
  Laptop,
  Cpu,
  Monitor,
  Keyboard,
  Play
} from "lucide-react";

const floatingIcons = [
  { Icon: Cpu, delay: 0, x: -80, y: -60 },
  { Icon: Monitor, delay: 0.2, x: 80, y: -40 },
  { Icon: Keyboard, delay: 0.4, x: -60, y: 60 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Zap className="h-4 w-4" />
            <span>Free • No Signup • Works in Browser</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Free Laptop Checker Online{" "}
            <span className="gradient-text">Check Your Laptop Now</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            #1 laptop checking tool for display, keyboard, camera, speakers & mic. 
            Perfect laptop checker for testing used laptops before buying.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center mb-16"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard">
                <Play className="h-5 w-5" />
                Start Testing
              </Link>
            </Button>
          </motion.div>

          {/* Laptop Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-lg"
          >
            {/* Floating Icons */}
            {floatingIcons.map(({ Icon, delay, x, y }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, x, y }}
                transition={{ duration: 0.6, delay: delay + 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="p-3 rounded-xl bg-card border border-border shadow-lg animate-float" style={{ animationDelay: `${delay}s` }}>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
            ))}

            {/* Main Laptop Icon */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card to-muted border border-border shadow-2xl animate-glow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <Laptop className="h-24 w-24 text-primary" />
              </div>
              <div className="mt-4 flex justify-center">
                <div className="h-1 w-24 rounded-full bg-muted-foreground/20" />
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {[
              { Icon: Shield, text: "100% Private" },
              { Icon: Zap, text: "Instant Results" },
              { Icon: Globe, text: "Works Everywhere" },
            ].map(({ Icon, text }, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
