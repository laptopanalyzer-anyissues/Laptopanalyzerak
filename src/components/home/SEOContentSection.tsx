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
} from "lucide-react";

const hardwareTests = [
  { icon: Monitor, text: "Display Test – detect dead pixels, check colors, and verify screen quality", path: "/test/display" },
  { icon: Keyboard, text: "Keyboard Test – ensure every key responds correctly", path: "/test/keyboard" },
  { icon: Camera, text: "Camera Test – test your webcam with live preview and snapshots", path: "/test/camera" },
  { icon: Mic, text: "Microphone Test – verify microphone input with real-time audio feedback", path: "/test/microphone" },
  { icon: Speaker, text: "Speaker Test – test left and right speaker output", path: "/test/audio" },
  { icon: MousePointer2, text: "Touchpad Test – check cursor movement, clicks, and gestures", path: "/test/touchpad" },
  { icon: Wifi, text: "Network Test – verify connection status and basic network functionality", path: "/test/network" },
  { icon: Cable, text: "Ports & Connectivity Test – check wired and wireless connections", path: "/test/ports" },
];

const benefits = [
  "Works completely online in your browser",
  "No downloads or installation required",
  "Simple and fast way to test a laptop",
  "Ideal for checking a laptop before use, resale, or troubleshooting",
];

const bulletSummary = [
  "Display and dead pixel test",
  "Keyboard and touchpad check",
  "Webcam and microphone test",
  "Speaker and sound test",
  "Network and basic performance checks",
];

export function SEOContentSection() {
  return (
    <section className="py-20 bg-background" aria-labelledby="seo-how-to">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* H2 – How to Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="seo-how-to" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            How to Test a Laptop Online with Laptop Analyzer
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Laptop Analyzer is a free laptop checker online that helps you test your laptop directly in your browser. Using this tool, you can check essential laptop hardware components and verify that they are working correctly without downloading or installing any software.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            This laptop test online tool is designed to quickly identify common hardware issues and ensure that your laptop's key input, output, and connectivity components function as expected.
          </p>
        </motion.div>

        {/* H3 – What Can You Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            What Can You Check with This Laptop Hardware Test?
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Laptop Analyzer includes a comprehensive testing suite that allows you to check your laptop hardware online, including:
          </p>
          <ul className="space-y-4 mb-6">
            {hardwareTests.map(({ icon: Icon, text, path }, index) => (
              <li key={index}>
                <Link to={path} className="flex items-start gap-3 group text-muted-foreground hover:text-foreground transition-colors">
                  <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-base leading-relaxed group-hover:underline">{text}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-lg leading-relaxed">
            These tests help you check a laptop online and confirm that its hardware components are working as intended.
          </p>
        </motion.div>

        {/* H3 – Why Use */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Why Use Laptop Analyzer to Test Your Laptop?
          </h3>
          <ul className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-base leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Laptop Analyzer makes it easy to test your laptop online and verify key hardware functions from one place.
          </p>
        </motion.div>

        {/* Bullet Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bulletSummary.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
                <span className="text-base">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
