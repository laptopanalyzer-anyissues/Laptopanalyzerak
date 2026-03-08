import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Speaker,
  Wifi,
  Mouse,
  Cable,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Display Test",
    description: "Dead pixel detection, color accuracy, and screen quality tests",
    path: "/test/display",
    color: "from-blue-500 to-cyan-500",
    shadow: "rgba(59, 130, 246, 0.4)",
  },
  {
    icon: Keyboard,
    title: "Keyboard Test",
    description: "Interactive keyboard tester to verify every key works",
    path: "/test/keyboard",
    color: "from-violet-500 to-purple-500",
    shadow: "rgba(139, 92, 246, 0.4)",
  },
  {
    icon: Camera,
    title: "Camera Test",
    description: "Test your webcam with live preview and snapshot",
    path: "/test/camera",
    color: "from-pink-500 to-rose-500",
    shadow: "rgba(236, 72, 153, 0.4)",
  },
  {
    icon: Mic,
    title: "Microphone Test",
    description: "Audio input test with real-time waveform visualization",
    path: "/test/microphone",
    color: "from-amber-500 to-orange-500",
    shadow: "rgba(245, 158, 11, 0.4)",
  },
  {
    icon: Speaker,
    title: "Speaker Test",
    description: "Stereo audio test for left and right speaker verification",
    path: "/test/audio",
    color: "from-green-500 to-emerald-500",
    shadow: "rgba(34, 197, 94, 0.4)",
  },
  {
    icon: Wifi,
    title: "Network Test",
    description: "Connection status, speed test, and latency check",
    path: "/test/network",
    color: "from-teal-500 to-cyan-500",
    shadow: "rgba(20, 184, 166, 0.4)",
  },
  {
    icon: Mouse,
    title: "Touchpad Test",
    description: "Track cursor movement, clicks, and scroll gestures",
    path: "/test/touchpad",
    color: "from-indigo-500 to-blue-500",
    shadow: "rgba(99, 102, 241, 0.4)",
  },
  {
    icon: Cable,
    title: "Ports & Connectivity",
    description: "Verify physical ports and wireless connections",
    path: "/test/ports",
    color: "from-orange-500 to-red-500",
    shadow: "rgba(249, 115, 22, 0.4)",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      role="listitem"
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Link to={feature.path} className="block h-full" aria-label={`${feature.title}: ${feature.description}`}>
          <div className="test-card h-full group relative overflow-hidden">
            {/* Animated gradient border on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
              style={{
                background: `linear-gradient(135deg, ${feature.shadow}, transparent 60%)`,
                filter: "blur(20px)",
                transform: "scale(1.1)",
              }}
              aria-hidden="true"
            />

            {/* Icon with float animation */}
            <motion.div
              className={`relative inline-flex p-3.5 rounded-xl bg-gradient-to-br ${feature.color} mb-5 shadow-lg`}
              style={{ boxShadow: `0 8px 20px -4px ${feature.shadow}` }}
              whileHover={{ scale: 1.15, rotate: 8 }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 },
                scale: { type: "spring", stiffness: 400, damping: 15 },
              }}
              aria-hidden="true"
            >
              <feature.icon className="h-6 w-6 text-white" />
            </motion.div>

            <h3 className="relative text-lg font-semibold text-foreground mb-2 group-hover:text-foreground transition-colors">
              {feature.title}
            </h3>
            <p className="relative text-sm text-muted-foreground mb-4">
              {feature.description}
            </p>

            {/* Arrow indicator */}
            <div className="relative flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-all">
              <span>Start Test</span>
              <motion.div
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Comprehensive Testing Suite
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Every tool you need to verify your laptop's hardware is working
            perfectly. All tests run directly in your browser.
          </motion.p>
        </motion.header>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Available laptop tests"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
