import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server } from "lucide-react";

const privacyFeatures = [
  {
    icon: Lock,
    title: "Local Processing",
    description: "All tests run entirely in your browser. Your data never leaves your device.",
  },
  {
    icon: Eye,
    title: "No Tracking",
    description: "We don't use cookies, analytics, or any form of user tracking.",
  },
  {
    icon: Server,
    title: "No Data Storage",
    description: "Test results are not stored on any server. Everything stays on your machine.",
  },
  {
    icon: Shield,
    title: "Transparent Permissions",
    description: "We only request permissions needed for specific tests, and only when you initiate them.",
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-6">
              <Shield className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Privacy Comes First
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              LaptopCheck is built with privacy at its core. No data collection,
              no servers, no compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
