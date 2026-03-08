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
    title: "General Inquiry",
    description: "Questions about our tools",
    color: "from-blue-500 to-cyan-500",
    shadow: "rgba(59, 130, 246, 0.3)",
  },
  {
    icon: Bug,
    title: "Bug Report",
    description: "Something not working right",
    color: "from-red-500 to-orange-500",
    shadow: "rgba(239, 68, 68, 0.3)",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Ideas for improvements",
    color: "from-amber-500 to-yellow-500",
    shadow: "rgba(245, 158, 11, 0.3)",
  },
  {
    icon: Shield,
    title: "Privacy Concern",
    description: "Data handling questions",
    color: "from-green-500 to-emerald-500",
    shadow: "rgba(34, 197, 94, 0.3)",
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
      title: "Message Sent!",
      description: "Thank you for reaching out. We will get back to you soon.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setSelectedReason(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Us - LaptopAnalyzer Support"
        description="Contact LaptopAnalyzer for support, bug reports, feature requests, or general inquiries. We're here to help with your laptop testing needs."
        keywords="contact laptopanalyzer, laptop test support, bug report, feature request, help"
        canonicalPath="/contact"
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6"
              style={{ boxShadow: "0 8px 30px -6px hsl(var(--primary) / 0.4)" }}
            >
              <Mail className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </motion.div>

          {/* Reason Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-sm font-medium text-muted-foreground text-center mb-4">
              What can we help you with?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contactReasons.map((reason, index) => (
                <motion.button
                  key={index}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedReason(index);
                    setFormData((prev) => ({ ...prev, subject: reason.title }));
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ${
                    selectedReason === index
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  {selectedReason === index && (
                    <motion.div
                      layoutId="reason-glow"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `radial-gradient(ellipse at center, ${reason.shadow}, transparent 70%)`,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative">
                    <div
                      className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${reason.color} mb-3`}
                      style={{ boxShadow: `0 4px 12px -2px ${reason.shadow}` }}
                    >
                      <reason.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="font-medium text-foreground text-sm">{reason.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{reason.description}</p>
                  </div>
                  {selectedReason === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Form + Info */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="p-6 md:p-8 rounded-2xl bg-card border border-border relative overflow-hidden">
                {/* Subtle corner accent */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.07] pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)",
                  }}
                />

                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
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
                      placeholder="What's this about?"
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
                      placeholder="Tell us more..."
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
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
                          Sending...
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
              </div>
            </motion.div>

            {/* Info strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Mail,
                  label: "Email Us",
                  value: "support@laptopanalyzer.com",
                },
                {
                  icon: Clock,
                  label: "Response Time",
                  value: "Within 24-48 hours",
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
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* FAQ CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border text-center"
            >
              <p className="text-muted-foreground text-sm">
                Looking for quick answers?{" "}
                <a href="/#faq" className="text-primary font-medium hover:underline">
                  Check our FAQ →
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
