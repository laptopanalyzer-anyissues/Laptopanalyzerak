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
  Zap,
} from "lucide-react";

const hardwareTests = [
  { icon: Monitor, text: "Display Test", desc: "Detect dead pixels, check colors, and verify screen quality", path: "/test/display" },
  { icon: Keyboard, text: "Keyboard Test", desc: "Ensure every key responds correctly", path: "/test/keyboard" },
  { icon: Camera, text: "Camera Test", desc: "Test your webcam with live preview and snapshots", path: "/test/camera" },
  { icon: Mic, text: "Microphone Test", desc: "Verify input with real-time audio feedback", path: "/test/microphone" },
  { icon: Speaker, text: "Speaker Test", desc: "Test left and right speaker output", path: "/test/audio" },
  { icon: MousePointer2, text: "Touchpad Test", desc: "Check cursor movement, clicks, and gestures", path: "/test/touchpad" },
  { icon: Wifi, text: "Network Test", desc: "Verify connection status and network functionality", path: "/test/network" },
  { icon: Cable, text: "Ports Test", desc: "Check wired and wireless connections", path: "/test/ports" },
];

const benefits = [
  "Works completely online in your browser",
  "No downloads or installation required",
  "Simple and fast way to test a laptop",
  "Ideal for checking before use, resale, or troubleshooting",
];

export function SEOContentSection() {
  return (
    <section className="py-20 bg-background" aria-labelledby="seo-how-to">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* H2 – How to Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>How It Works</span>
          </div>
          <h2 id="seo-how-to" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            How to Test a Laptop Online with Laptop Analyzer
          </h2>
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Laptop Analyzer is a free laptop checker online that helps you test your laptop directly in your browser. Using this tool, you can check essential laptop hardware components and verify that they are working correctly without downloading or installing any software.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              This laptop test online tool is designed to quickly identify common hardware issues and ensure that your laptop's key input, output, and connectivity components function as expected.
              Check out our{" "}
              <Link to="/blog" className="text-primary hover:underline font-medium">
                guides and articles
              </Link>{" "}
              for detailed walkthroughs on testing specific hardware.
            </p>
          </div>
        </motion.div>

        {/* H3 – What Can You Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            What Can You Check with This Laptop Hardware Test?
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Laptop Analyzer includes a comprehensive testing suite that allows you to check your laptop hardware online, including:
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
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            These tests help you check a laptop online and confirm that its hardware components are working as intended.
          </p>
        </motion.div>

        {/* H3 – Why Use */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Why Use Laptop Analyzer to Test Your Laptop?
          </h3>
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-base text-muted-foreground leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Laptop Analyzer makes it easy to test your laptop online and verify key hardware functions from one place.
              For more tips, guides, and troubleshooting help, visit our{" "}
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
