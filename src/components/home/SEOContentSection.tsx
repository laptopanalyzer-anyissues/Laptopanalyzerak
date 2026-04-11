import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Speaker,
  MousePointer2,
  Wifi,
  Cable,
  CheckCircle,
  BookOpen,
} from "lucide-react";

const hardwareTests = [
  { icon: Monitor, text: "Display Test", desc: "Dead pixels, color accuracy, and screen quality", path: "/test/display" },
  { icon: Keyboard, text: "Keyboard Test", desc: "Key response and layout verification", path: "/test/keyboard" },
  { icon: Camera, text: "Camera Test", desc: "Live webcam preview and snapshots", path: "/test/camera" },
  { icon: Mic, text: "Microphone Test", desc: "Real-time audio input feedback", path: "/test/microphone" },
  { icon: Speaker, text: "Speaker Test", desc: "Left and right speaker output", path: "/test/audio" },
  { icon: MousePointer2, text: "Touchpad Test", desc: "Cursor, clicks, and gesture tracking", path: "/test/touchpad" },
  { icon: Wifi, text: "Network Test", desc: "Connection status and speed", path: "/test/network" },
  { icon: Cable, text: "Ports Test", desc: "Wired and wireless connections", path: "/test/ports" },
];

const benefits = [
  "Works entirely in your browser",
  "No downloads or installation",
  "Fast results for buying, selling, or troubleshooting",
  "Privacy-conscious — tests run locally",
];

export function SEOContentSection() {
  return (
    <section className="py-16" aria-labelledby="seo-how-to">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* What You Can Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>Complete Test Suite</span>
          </div>
          <h2 id="seo-how-to" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How to Test a Laptop Online with Laptop Analyzer
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mb-8">
            Laptop Analyzer is a free online laptop diagnostics tool that helps you verify essential hardware components directly in your browser — no software to install. Explore our{" "}
            <Link to="/blog" className="text-primary hover:underline font-medium">
              guides and articles
            </Link>{" "}
            for detailed walkthroughs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hardwareTests.map(({ icon: Icon, text, desc, path }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={path}
                  className="glass-card rounded-xl p-5 flex flex-col gap-3 h-full group hover:border-primary/30 transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                    {text}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Use — compact benefits row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              For tips and troubleshooting, visit our{" "}
              <Link to="/blog" className="text-primary hover:underline font-medium">
                blog and how-to guides
              </Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
