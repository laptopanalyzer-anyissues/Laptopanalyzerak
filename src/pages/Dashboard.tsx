import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { TestCard } from "@/components/dashboard/TestCard";
import {
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Speaker,
  Wifi,
  Mouse,
  Cable,
  Activity,
} from "lucide-react";

const tests = [
  {
    icon: Monitor,
    title: "Display Test",
    description: "Check for dead pixels, color accuracy, and screen quality",
    path: "/test/display",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Keyboard,
    title: "Keyboard Test",
    description: "Verify every key on your keyboard works correctly",
    path: "/test/keyboard",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Mouse,
    title: "Touchpad Test",
    description: "Test cursor tracking, clicks, and scroll gestures",
    path: "/test/touchpad",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Camera,
    title: "Camera Test",
    description: "Test your webcam with live preview and snapshot",
    path: "/test/camera",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "Microphone Test",
    description: "Audio input test with real-time visualization",
    path: "/test/microphone",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Speaker,
    title: "Speaker Test",
    description: "Verify left and right speaker audio output",
    path: "/test/audio",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Wifi,
    title: "Network Test",
    description: "Test connection status and network speed",
    path: "/test/network",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Cable,
    title: "Ports & Connectivity",
    description: "Verify physical ports and wireless connections",
    path: "/test/ports",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Activity,
    title: "Sensor Suite",
    description: "Test motion, orientation, and environment sensors",
    path: "/test/sensors",
    gradient: "from-purple-500 to-pink-500",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Laptop Diagnostics
            </h1>
            <p className="text-muted-foreground">
              Select a test to verify your laptop's hardware components
            </p>
          </motion.div>

          

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Available Tests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tests.map((test, index) => (
                <TestCard key={index} {...test} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
