import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  Clock,
  HelpCircle,
  Bug,
  Lightbulb,
  Shield,
  CheckCircle2,
  Globe,
  ArrowRight,
  Lock,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";

const categories = [
  {
    icon: HelpCircle,
    title: "General Support",
    description: "Help with tests, results, or getting started",
    color: "from-primary to-accent",
  },
  {
    icon: Bug,
    title: "Bug Report",
    description: "A test isn't loading, crashing, or returning wrong results",
    color: "from-destructive to-warning",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Suggest a new diagnostic tool or improvement",
    color: "from-warning to-[hsl(45,90%,55%)]",
  },
  {
    icon: Shield,
    title: "Privacy Inquiry",
    description: "Questions about data, cookies, or browser permissions",
    color: "from-success to-accent",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Message received",
      description: "We'll get back to you within 24–48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSelectedCategory(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Support - LaptopAnalyzer"
        description="Reach the Laptop Analyzer support team for technical help, bug reports, feature ideas, or privacy questions. We respond within 24–48 hours."
        keywords="contact laptopanalyzer, laptop test support, bug report, feature request, privacy inquiry"
        canonicalPath="/contact"
      />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* ── Hero ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 240, damping: 18 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-5"
              style={{ boxShadow: "0 8px 28px -6px hsl(var(--primary) / 0.35)" }}
            >
              <Headphones className="h-6 w-6 text-primary-foreground" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
              We're Here to Help
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Whether it's a technical issue, a feature idea, or a privacy question — our team responds within one business day.
            </p>
          </motion.section>

          {/* ── Category Selector ── */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <p className="text-xs font-medium text-muted-foreground text-center mb-4 uppercase tracking-wider">
              What do you need help with?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat, i) => {
                const active = selectedCategory === i;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedCategory(i);
                      setFormData((prev) => ({ ...prev, subject: cat.title }));
                    }}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                      active
                        ? "border-primary/50 bg-primary/[0.06] ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-muted-foreground/20"
                    }`}
                  >
                    <div
                      className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${cat.color} mb-3`}
                      style={{
                        boxShadow: active
                          ? "0 4px 14px -3px hsl(var(--primary) / 0.3)"
                          : "0 2px 6px -2px hsl(var(--foreground) / 0.08)",
                      }}
                    >
                      <cat.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <p className="font-semibold text-foreground text-[13px] leading-tight">{cat.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{cat.description}</p>
                    {active && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2.5 right-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* ── Form ── */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 relative overflow-hidden">
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-[0.04] pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
              />

              <div className="flex items-center gap-2 mb-5 pb-5 border-b border-border/60">
                <Mail className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Send us a message</h2>
                <span className="ml-auto text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Avg. reply: 24–48 hrs
                </span>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Full Name</Label>
                    <Input id="name" name="name" placeholder="Jane Doe" value={formData.name} onChange={handleInputChange} required className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required className="h-11" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs">Subject</Label>
                  <Input id="subject" name="subject" placeholder="Brief summary of your request" value={formData.subject} onChange={handleInputChange} required className="h-11" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs">Message</Label>
                  <Textarea id="message" name="message" placeholder="Describe your issue or question in detail…" rows={5} value={formData.message} onChange={handleInputChange} required />
                </div>

                <Button type="submit" variant="hero" className="w-full h-12 text-sm font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Sending…
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>

              {/* Privacy line */}
              <div className="mt-4 flex items-start gap-2 px-1">
                <Lock className="h-3 w-3 text-muted-foreground mt-[3px] flex-shrink-0" />
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  Your information is used solely to respond to this inquiry. Do not include sensitive financial data.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Info Cards ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {[
              { icon: Mail, label: "Email", value: "support@laptopanalyzer.com" },
              { icon: Clock, label: "Response", value: "Within 24–48 hours" },
              { icon: Globe, label: "Coverage", value: "Worldwide, 100 % online" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{item.label}</p>
                  <p className="text-sm font-medium text-foreground break-all leading-tight mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.section>

          {/* ── FAQ Block ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33 }}
            className="mt-5 rounded-xl bg-gradient-to-r from-primary/[0.06] to-accent/[0.04] border border-primary/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-sm font-bold text-foreground mb-0.5">Need a quicker answer?</h2>
              <p className="text-xs text-muted-foreground max-w-sm">
                Check our FAQ — most common questions about tests, permissions, and compatibility are already answered.
              </p>
            </div>
            <a
              href="/#faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap group"
            >
              Visit FAQ
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
