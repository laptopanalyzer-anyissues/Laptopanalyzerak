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
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";

const contactReasons = [
  {
    icon: HelpCircle,
    title: "General Support",
    description: "Questions about tests, features, or your results",
    color: "from-primary to-accent",
  },
  {
    icon: Bug,
    title: "Bug Report",
    description: "Something broken or not working as expected",
    color: "from-destructive to-warning",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Suggest improvements or new diagnostic tools",
    color: "from-warning to-[hsl(45,90%,55%)]",
  },
  {
    icon: Shield,
    title: "Privacy Inquiry",
    description: "Data handling, cookies, or permission questions",
    color: "from-success to-accent",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
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
      title: "Message sent",
      description: "We've received your message and will respond within 24–48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSelectedReason(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Support - LaptopAnalyzer"
        description="Get help from the Laptop Analyzer support team. Report bugs, request features, or ask about privacy. We respond within 24–48 hours."
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
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-5"
              style={{ boxShadow: "0 8px 28px -6px hsl(var(--primary) / 0.35)" }}
            >
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
              How Can We Help?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Our support team is here to assist with technical issues, feature ideas, and privacy questions. We typically respond within one business day.
            </p>
          </motion.section>

          {/* ── Category Cards ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-12"
          >
            <p className="text-sm font-medium text-muted-foreground text-center mb-5">
              Select a category to help us route your request
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contactReasons.map((reason, index) => {
                const isSelected = selectedReason === index;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedReason(index);
                      setFormData((prev) => ({ ...prev, subject: reason.title }));
                    }}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 group ${
                      isSelected
                        ? "border-primary/60 bg-primary/[0.06] ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-muted-foreground/25 hover:bg-card/80"
                    }`}
                  >
                    <div className="relative z-10">
                      <div
                        className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${reason.color} mb-3 transition-shadow`}
                        style={{
                          boxShadow: isSelected
                            ? "0 4px 16px -3px hsl(var(--primary) / 0.3)"
                            : "0 2px 8px -2px hsl(var(--primary) / 0.15)",
                        }}
                      >
                        <reason.icon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <p className="font-semibold text-foreground text-sm leading-tight">
                        {reason.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        {reason.description}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2.5 right-2.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* ── Form Card ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 relative overflow-hidden">
              {/* Subtle glow */}
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-[0.05] pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
              />

              {/* Microcopy */}
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  We aim to respond within 24–48 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief summary of your request"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help…"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground/70">
                    For privacy-related concerns, include "Privacy Inquiry" in the subject line.
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Sending…
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Privacy note */}
              <div className="mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/50 border border-border/60">
                <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Information submitted through this form is used only to respond to your inquiry. Please avoid sending sensitive personal or financial information.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Support Info Strip ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {[
              {
                icon: Mail,
                label: "Support Email",
                value: "support@laptopanalyzer.com",
              },
              {
                icon: Clock,
                label: "Response Time",
                value: "Within 24–48 hours",
              },
              {
                icon: Globe,
                label: "Availability",
                value: "Worldwide, 100% online",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground break-all">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* ── FAQ Block ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 p-5 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-1">
                Need a quicker answer?
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                You may find answers to common questions in our FAQ before reaching out to support.
              </p>
            </div>
            <a
              href="/#faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
            >
              Visit the FAQ
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
