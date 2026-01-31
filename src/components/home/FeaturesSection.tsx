import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Speaker,
  Wifi,
  Mouse,
  Cable,
} from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Display Test",
    description: "Dead pixel detection, color accuracy, and screen quality tests",
    path: "/test/display",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Keyboard,
    title: "Keyboard Test",
    description: "Interactive keyboard tester to verify every key works",
    path: "/test/keyboard",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Camera,
    title: "Camera Test",
    description: "Test your webcam with live preview and snapshot",
    path: "/test/camera",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "Microphone Test",
    description: "Audio input test with real-time waveform visualization",
    path: "/test/microphone",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Speaker,
    title: "Speaker Test",
    description: "Stereo audio test for left and right speaker verification",
    path: "/test/audio",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Wifi,
    title: "Network Test",
    description: "Connection status, speed test, and latency check",
    path: "/test/network",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Mouse,
    title: "Touchpad Test",
    description: "Track cursor movement, clicks, and scroll gestures",
    path: "/test/touchpad",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Cable,
    title: "Ports & Connectivity",
    description: "Verify physical ports and wireless connections",
    path: "/test/ports",
    color: "from-orange-500 to-red-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Testing Suite
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every tool you need to verify your laptop's hardware is working
            perfectly. All tests run directly in your browser.
          </p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Available laptop tests"
        >
          {features.map((feature, index) => (
            <motion.article key={index} variants={itemVariants} role="listitem">
              <Link to={feature.path} className="block h-full" aria-label={`${feature.title}: ${feature.description}`}>
                <div className="test-card h-full group">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    aria-hidden="true"
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
