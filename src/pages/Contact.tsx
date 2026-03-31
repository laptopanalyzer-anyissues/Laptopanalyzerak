import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";

const categories = [
  { icon: HelpCircle, title: "General Support", color: "from-primary to-accent" },
  { icon: Bug, title: "Bug Report", color: "from-destructive to-warning" },
  { icon: Lightbulb, title: "Feature Request", color: "from-warning to-[hsl(45,90%,55%)]" },
  { icon: Shield, title: "Privacy Inquiry", color: "from-success to-accent" },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Message sent", description: "We'll respond within 24–48 hours." });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSelected(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Support - LaptopAnalyzer"
        description="Reach the Laptop Analyzer support team for technical help, bug reports, feature ideas, or privacy questions."
        keywords="contact laptopanalyzer, support, bug report, feature request"
        canonicalPath="/contact"
      />
      <Header />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
              Get in Touch
            </h1>
            <p className="text-muted-foreground">
              Questions, bug reports, feature ideas, or privacy inquiries.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="grid grid-cols-4 gap-2 mb-8"
          >
            {categories.map((cat, i) => {
              const active = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => { setSelected(i); setFormData((p) => ({ ...p, subject: cat.title })); }}
                  className={`relative flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl border text-center transition-all duration-150 ${
                    active
                      ? "border-primary/50 bg-primary/[0.06]"
                      : "border-border bg-card hover:border-muted-foreground/20"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${cat.color}`}>
                    <cat.icon className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground leading-tight">{cat.title}</span>
                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-2xl bg-card border border-border p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Name</Label>
                  <Input id="name" name="name" placeholder="Jane Doe" value={formData.name} onChange={handleChange} required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required className="h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs">Subject</Label>
                <Input id="subject" name="subject" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs">Message</Label>
                <Textarea id="message" name="message" placeholder="How can we help?" rows={4} value={formData.message} onChange={handleChange} required />
              </div>

              <Button type="submit" variant="hero" className="w-full h-11 text-sm font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Sending…
                  </span>
                ) : (
                  <><Send className="h-4 w-4 mr-2" />Send Message</>
                )}
              </Button>
            </form>

            <p className="text-[11px] text-muted-foreground/70 mt-4 text-center">
              We respond within 24–48 hours. Please avoid sending sensitive personal or financial information.
            </p>
          </motion.div>

          {/* Info row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3 text-primary" />support@laptopanalyzer.com</span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary" />24–48 hr response</span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3 w-3 text-primary" />Worldwide support</span>
          </motion.div>

          {/* FAQ link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mt-8 text-center text-xs text-muted-foreground"
          >
            Looking for quick answers?{" "}
            <a href="/#faq" className="text-primary font-medium hover:underline inline-inline-flex items-center gap-0.5 group">
              Visit the FAQ <ArrowRight className="inline h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
