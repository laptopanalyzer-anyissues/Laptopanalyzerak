import { motion } from "framer-motion";
import { MousePointer2, Play, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    step: "01",
    title: "Choose a Test",
    description: "Pick from 8 hardware diagnostics — display, keyboard, camera, and more.",
  },
  {
    icon: Play,
    step: "02",
    title: "Run It Instantly",
    description: "Tests run directly in your browser. No downloads, no permissions needed upfront.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "See Your Results",
    description: "Get clear, immediate feedback on whether your hardware is working correctly.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30" aria-labelledby="how-works-heading">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2
            id="how-works-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three steps. No setup. Just results.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative text-center group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}

              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-card border border-border shadow-md mb-6 mx-auto group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300"
              >
                <s.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
                  {s.step}
                </span>
              </motion.div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
