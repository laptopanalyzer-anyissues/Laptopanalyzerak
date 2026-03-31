import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server } from "lucide-react";

const privacyFeatures = [
  {
    icon: Lock,
    title: "Runs Locally",
    description: "Hardware tests execute directly in your browser — no uploads or external processing required.",
  },
  {
    icon: Eye,
    title: "Privacy-Conscious",
    description: "Designed to minimize data collection. We don't profile users or sell data.",
  },
  {
    icon: Server,
    title: "Minimal Data Handling",
    description: "Test results stay on your device. We don't store or retain your hardware diagnostics.",
  },
  {
    icon: Shield,
    title: "Permissions on Demand",
    description: "Camera, mic, or USB access is requested only when you start a specific test.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function PrivacySection() {
  return (
    <section id="privacy" className="py-24" aria-labelledby="privacy-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <header className="text-center mb-12">
            {/* Animated Shield Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.1 
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-6 relative"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    "0 0 0 20px rgba(34, 197, 94, 0)",
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-2xl"
                />
                <Shield className="h-8 w-8 text-success" aria-hidden="true" />
              </motion.div>

            <motion.h2
              id="privacy-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Built for Privacy
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Every test runs in your browser. No uploads, no servers, no accounts.
            </motion.p>
          </header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            role="list"
            aria-label="Privacy features"
          >
            {privacyFeatures.map((feature, index) => (
              <motion.article
                key={index}
                role="listitem"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-success/30 hover:shadow-lg hover:shadow-success/5 transition-colors duration-300 cursor-default"
              >
                <div className="flex-shrink-0">
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                    className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"
                  >
                    <feature.icon className="h-6 w-6 text-success" aria-hidden="true" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}