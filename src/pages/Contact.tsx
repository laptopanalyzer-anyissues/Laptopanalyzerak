import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  HelpCircle,
  Bug,
  Lightbulb,
  Shield,
  CheckCircle2,
  Mail,
  Clock,
  Globe,
  ArrowRight,
  MessageSquare,
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
    desc: "Help with tests or results",
    gradient: "from-primary to-accent",
    glow: "hsl(var(--primary) / 0.25)",
  },
  {
    icon: Bug,
    title: "Bug Report",
    desc: "Something isn't working right",
    gradient: "from-destructive to-warning",
    glow: "hsl(var(--destructive) / 0.25)",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    desc: "Suggest a new tool or improvement",
    gradient: "from-warning to-[hsl(50,92%,55%)]",
    glow: "hsl(var(--warning) / 0.25)",
  },
  {
    icon: Shield,
    title: "Privacy Inquiry",
    desc: "Data, cookies, or permissions",
    gradient: "from-success to-accent",
    glow: "hsl(var(--success) / 0.25)",
  },
];

const infoItems = [
  { icon: Mail, label: "Email", value: "support@laptopanalyzer.com" },
  { icon: Clock, label: "Response", value: "Within 24–48 hours" },
  { icon: Globe, label: "Coverage", value: "Worldwide support" },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Message sent",
      description: "We'll get back to you within 24–48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSelected(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Support - LaptopAnalyzer"
        description="Reach the Laptop Analyzer support team for technical help, bug reports, feature ideas, or privacy questions."
        keywords="contact laptopanalyzer, support, bug report, feature request, privacy inquiry"
        canonicalPath="/contact"
      />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* ═══ Hero ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 220,
                damping: 16,
              }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-5"
              style={{
                boxShadow: "0 8px 30px -6px hsl(var(--primary) / 0.35)",
              }}
            >
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              Support, bug reports, feature requests, and privacy questions.
            </p>
          </motion.section>

          {/* ═══ Category Cards ═══ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
          >
            {categories.map((cat, i) => {
              const active = selected === i;
              return (
                <motion.button
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 18, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelected(i);
                    setFormData((p) => ({ ...p, subject: cat.title }));
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden group ${
                    active
                      ? "border-primary/50 bg-primary/[0.06]"
                      : "border-border bg-card hover:border-primary/25"
                  }`}
                  style={{
                    boxShadow: active
                      ? `0 0 24px -4px ${cat.glow}`
                      : "none",
                  }}
                >
                  {/* Hover glow layer */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 80%, ${cat.glow}, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${cat.gradient} mb-3`}
                      animate={active ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.4 }}
                      style={{
                        boxShadow: `0 4px 14px -3px ${cat.glow}`,
                      }}
                    >
                      <cat.icon className="h-4 w-4 text-primary-foreground" />
                    </motion.div>

                    <p className="font-semibold text-foreground text-sm leading-tight">
                      {cat.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {cat.desc}
                    </p>
                  </div>

                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-2.5 right-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.section>

          {/* ═══ Form Card ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 relative overflow-hidden">
              {/* Corner glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.05] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--primary)), transparent 70%)",
                }}
              />

              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-11 transition-shadow duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-11 transition-shadow duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief summary of your request"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="h-11 transition-shadow duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help…"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="transition-shadow duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full h-12 text-sm font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Sending…
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <p className="text-[11px] text-muted-foreground/60 text-center mt-4">
                We respond within 24–48 hours · Please avoid sending sensitive
                financial information.
              </p>
            </div>
          </motion.section>

          {/* ═══ Support Info Row ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border transition-colors hover:border-primary/20"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground break-all leading-tight mt-0.5">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* ═══ FAQ ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 rounded-xl bg-gradient-to-r from-primary/[0.05] to-accent/[0.03] border border-primary/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                Need a quicker answer?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Most common questions are already covered in our FAQ.
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
