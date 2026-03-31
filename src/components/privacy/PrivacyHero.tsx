import { motion } from "framer-motion";
import { Shield, CheckCircle, Zap, Eye, Lock } from "lucide-react";

const glanceItems = [
  { icon: Lock, text: "No account or sign-up required" },
  { icon: Zap, text: "Diagnostic tests run locally in your browser" },
  { icon: Eye, text: "We use Analytics & AdSense — disclosed below" },
  { icon: Shield, text: "Permissions requested only when you start a test" },
];

export function PrivacyHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-card to-primary/5 border border-border p-8 md:p-12 mb-10">
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
          How we handle your data — explained plainly, without the legal fog.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-wrap items-center gap-4 text-sm mb-8"
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

        {/* Privacy at a Glance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="rounded-xl bg-background/60 backdrop-blur-sm border border-border p-5"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            Privacy at a glance
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {glanceItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
