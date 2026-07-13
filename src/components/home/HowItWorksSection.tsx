import { motion } from "framer-motion";
import { MousePointer2, Play, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    step: 1,
    title: "Pick a Test",
    description: "Choose from 8 hardware diagnostics — or run them all at once.",
  },
  {
    icon: Play,
    step: 2,
    title: "Run It",
    description: "Each test runs directly in your browser. No downloads required.",
  },
  {
    icon: ClipboardCheck,
    step: 3,
    title: "Get Results",
    description: "Clear, immediate feedback on whether your hardware works.",
  },
];
export function HowItWorksSection() {
  return (
    <section className="py-20" aria-labelledby="how-works-heading">
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
              {/* Connector line — sits behind the icons (z-0) and draws in from
                  left to right as the section scrolls into view, spanning from
                  this icon's centre to the next (card width + gap-8).
                  The outer wrapper is the in-view trigger (it keeps a non-zero
                  area so IntersectionObserver fires); the inner line runs the
                  scaleX draw, which would otherwise collapse the trigger's area. */}
              {index < steps.length - 1 && (
                <motion.div
                  aria-hidden="true"
                  className="hidden md:block absolute top-16 left-1/2 z-0 w-[calc(100%_+_2rem)] h-px overflow-hidden"
                  initial="hidden"
                  whileInView="shown"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="h-full w-full bg-border origin-left"
                    variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                    transition={{ duration: 0.6, delay: 0.35 + index * 0.25, ease: "easeInOut" }}
                  />
                </motion.div>
              )}

              <div className="flex flex-col items-center mb-6">
                <span className="text-sm font-semibold text-primary mb-3 tracking-wide">
                  Step {s.step}
                </span>
                <motion.div
                  whileHover={{ scale: 1.06, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-card border border-border/60 shadow-md group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300"
                >
                  <s.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                </motion.div>
              </div>

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
