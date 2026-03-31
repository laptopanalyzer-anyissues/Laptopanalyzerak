import { motion } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";

export function PrivacyHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-card to-primary/5 border border-border p-8 md:p-12 mb-10">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6"
        >
          <Shield className="h-7 w-7 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3"
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-lg text-muted-foreground max-w-2xl mb-6"
        >
          We believe in transparency. This policy explains how Laptop Analyzer handles your information — clearly, honestly, and without the legal jargon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-wrap items-center gap-4 text-sm"
        >
          <span className="text-muted-foreground">
            Last updated: January 15, 2025
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-success" />
            AdSense compliant
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-success" />
            GDPR-aware
          </span>
        </motion.div>
      </div>
    </div>
  );
}
