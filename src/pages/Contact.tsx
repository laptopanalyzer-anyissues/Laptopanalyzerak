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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { isValidEmail, isValidLength, hasXSSPatterns } from "@/lib/security";
import { useRateLimit } from "@/hooks/useRateLimit";

const categories = [
  {
    icon: HelpCircle,
    title: "General Support",
    desc: "Help with tests or results",
    gradient: "from-primary to-accent",
    glowColor: "var(--primary)",
  },
  {
    icon: Bug,
    title: "Bug Report",
    desc: "Something isn't working right",
    gradient: "from-destructive to-warning",
    glowColor: "var(--destructive)",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    desc: "Suggest a new tool or idea",
    gradient: "from-warning to-[hsl(50,92%,55%)]",
    glowColor: "var(--warning)",
  },
  {
    icon: Shield,
    title: "Privacy Inquiry",
    desc: "Data, cookies, or permissions",
    gradient: "from-success to-accent",
    glowColor: "var(--success)",
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { checkLimit, isBlocked, retryAfter } = useRateLimit("contact_form", {
    maxRequests: 3,
    windowMs: 60000,
    blockDurationMs: 120000,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!isValidLength(formData.name.trim(), 1, 100)) {
      errors.name = "Name is required (max 100 characters)";
    }
    if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!isValidLength(formData.subject.trim(), 1, 200)) {
      errors.subject = "Subject is required (max 200 characters)";
    }
    if (!isValidLength(formData.message.trim(), 10, 5000)) {
      errors.message = "Message must be 10–5,000 characters";
    }

    // Check for XSS patterns in all fields
    const allValues = [formData.name, formData.email, formData.subject, formData.message];
    if (allValues.some(hasXSSPatterns)) {
      errors.message = "Your message contains content that cannot be processed.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!checkLimit()) {
      toast({
        title: "Too many submissions",
        description: `Please wait ${retryAfter ?? 60} seconds before trying again.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Message sent",
      description: "We'll get back to you within 24–48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setFormErrors({});
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
        structuredData={structuredData.breadcrumbs([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
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
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 relative"
              style={{ boxShadow: "0 10px 36px -8px hsl(var(--primary) / 0.4)" }}
            >
              <MessageSquare className="h-7 w-7 text-primary-foreground" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0px hsl(var(--primary) / 0.3)",
                    "0 0 0 12px hsl(var(--primary) / 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
              className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto"
            >
              Support, bug reports, feature requests, and privacy questions.
            </motion.p>
          </motion.section>

          {/* ═══ Category Cards ═══ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
            }}
            className="mb-14"
          >
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-xs font-medium text-muted-foreground text-center mb-4 uppercase tracking-wider"
            >
              What can we help with?
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat, i) => {
                const active = selected === i;
                const glowHsl = `hsl(${cat.glowColor} / 0.25)`;
                const glowHslStrong = `hsl(${cat.glowColor} / 0.35)`;

                return (
                  <motion.button
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.92 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: "spring", stiffness: 260, damping: 20 },
                      },
                    }}
                    whileHover={{ y: -5, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setSelected(i);
                      setFormData((p) => ({ ...p, subject: cat.title }));
                    }}
                    className={`relative p-5 rounded-xl border text-left transition-all duration-300 overflow-hidden group cursor-pointer ${
                      active
                        ? "border-primary/50 bg-primary/[0.07]"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                    style={{
                      boxShadow: active ? `0 0 28px -4px ${glowHslStrong}, inset 0 1px 0 0 hsl(${cat.glowColor} / 0.1)` : "none",
                    }}
                  >
                    {/* Hover radial glow */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 50% 100%, ${glowHsl}, transparent 65%)`,
                      }}
                    />

                    {/* Active shimmer line */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl pointer-events-none"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, hsl(${cat.glowColor} / 0.6) 50%, transparent 100%)`,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      <motion.div
                        className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${cat.gradient} mb-3`}
                        animate={active ? { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        style={{ boxShadow: `0 6px 18px -4px ${glowHsl}` }}
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
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="absolute top-3 right-3"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* ═══ Form Card ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 relative overflow-hidden">
              {/* Corner glow */}
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-[0.04] pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-[0.03] pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
              />

              {/* Form header */}
              <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-border/60">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Send us a message</h2>
                <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Avg. reply: 24–48 hrs</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div className="space-y-1.5" whileFocus={{ scale: 1 }}>
                    <Label htmlFor="name" className="text-xs font-medium">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className={`h-11 transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] focus:border-primary/40 ${formErrors.name ? "border-destructive" : ""}`}
                    />
                    {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
                  </motion.div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                      className={`h-11 transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] focus:border-primary/40 ${formErrors.email ? "border-destructive" : ""}`}
                    />
                    {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-medium">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief summary of your request"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    className={`h-11 transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] focus:border-primary/40 ${formErrors.subject ? "border-destructive" : ""}`}
                  />
                  {formErrors.subject && <p className="text-xs text-destructive">{formErrors.subject}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-medium">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help…"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    className={`transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] focus:border-primary/40 ${formErrors.message ? "border-destructive" : ""}`}
                  />
                  {formErrors.message && <p className="text-xs text-destructive">{formErrors.message}</p>}
                </div>

                <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full h-12 text-sm font-semibold group"
                    disabled={isSubmitting || isBlocked}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Sending…
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-0.5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <p className="text-[11px] text-muted-foreground/50 text-center mt-4">
                We respond within 24–48 hours · Avoid sending sensitive financial information.
              </p>
            </div>
          </motion.section>

          {/* ═══ Support Info Row ═══ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
            }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3, borderColor: "hsl(var(--primary) / 0.2)" }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
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
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl bg-gradient-to-r from-primary/[0.05] to-accent/[0.03] border border-primary/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">Need a quicker answer?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Most common questions are already covered in our FAQ.
              </p>
            </div>
            <a
              href="/#faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap group"
            >
              Visit FAQ
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
