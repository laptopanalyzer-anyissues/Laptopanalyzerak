import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Shield, Wifi, WifiOff, Monitor, Keyboard, Camera, Mic, Speaker, Cpu, HardDrive, Gauge, Zap } from "lucide-react";

const features = [
  { icon: Cpu, label: "CPU Benchmark" },
  { icon: HardDrive, label: "Memory Analysis" },
  { icon: Monitor, label: "GPU Performance" },
  { icon: Gauge, label: "Storage Speed" },
  { icon: Wifi, label: "Network Status" },
  { icon: Zap, label: "Battery Health" },
  { icon: Monitor, label: "Display Test" },
  { icon: Keyboard, label: "Keyboard Test" },
  { icon: Speaker, label: "Speaker Test" },
  { icon: Mic, label: "Microphone Test" },
  { icon: Camera, label: "Camera Test" },
  { icon: Gauge, label: "System Latency" },
];

const DownloadSoftware = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/downloads/LaptopAnalyzer-Diagnostic.html";
    link.download = "LaptopAnalyzer-Pro-Diagnostic.html";
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Download Free Laptop Diagnostic Software | LaptopAnalyzer"
        description="Download LaptopAnalyzer Pro — a free, offline laptop diagnostic tool. Tests CPU, GPU, memory, display, keyboard, speakers, camera & more. No installation required."
        keywords="laptop diagnostic software, free laptop test tool, hardware diagnostic download, pc health checker, offline diagnostic"
        canonicalPath="/download"
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Download className="w-4 h-4" />
              Free Download — No Installation Required
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              LaptopAnalyzer Pro
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional-grade hardware diagnostic tool that runs entirely in your browser. 
              One file. Zero installation. Complete offline support.
            </p>
            <Button size="xl" variant="hero" onClick={handleDownload} className="text-lg">
              <Download className="w-5 h-5 mr-2" />
              Download Diagnostic Tool
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Single HTML file (≈30KB) • Works offline • No data collection
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-6">
              12 Comprehensive Tests Included
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <f.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-6">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Download", desc: "Click the download button to get the single HTML file." },
                { step: "2", title: "Open", desc: "Double-click the file to open it in any modern browser." },
                { step: "3", title: "Diagnose", desc: "Run all tests and download your detailed hardware report." },
              ].map((s, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-4 mb-12"
          >
            {[
              { icon: Shield, title: "100% Safe", desc: "No executables. Just an HTML file running in your browser sandbox." },
              { icon: WifiOff, title: "Works Offline", desc: "No internet needed after download. All tests run locally." },
              { icon: Download, title: "Free Forever", desc: "No sign-up, no trial, no hidden fees. Completely free." },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-muted/50 border border-border">
                <b.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground text-sm">{b.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" variant="hero" onClick={handleDownload}>
              <Download className="w-5 h-5 mr-2" />
              Download Now — It's Free
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadSoftware;
