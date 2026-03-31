import { motion } from "framer-motion";
import { Zap, ShieldCheck, Download, Gauge } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Instant, In-Browser",
    description:
      "Open the page and start. No accounts, no installs, no waiting.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First Design",
    description:
      "Tests run locally in your browser. We minimize data handling and don't store your results.",
  },
  {
    icon: Download,
    title: "Zero Downloads",
    description:
      "Works on any modern browser and OS. Nothing to install or update.",
  },
  {
    icon: Gauge,
    title: "8 Diagnostic Tests",
    description:
      "Display, keyboard, camera, mic, speakers, network, touchpad, and ports — all covered.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: "easeOut" },
  }),
};

export function WhySection() {
  return (
    <section className="py-20" aria-labelledby="why-heading">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2
            id="why-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Why Laptop Analyzer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify your laptop hardware works — before you buy, sell, or troubleshoot.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"
                >
                  <reason.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
