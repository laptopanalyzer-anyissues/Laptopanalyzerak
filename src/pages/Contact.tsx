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
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { isValidEmail, isValidLength, hasXSSPatterns } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { icon: HelpCircle, title: "General Support", desc: "Help with tests or results" },
  { icon: Bug, title: "Bug Report", desc: "Something isn't working right" },
  { icon: Lightbulb, title: "Feature Request", desc: "Suggest a new tool or idea" },
  { icon: Shield, title: "Privacy Inquiry", desc: "Data, cookies, or permissions" },
];

const infoItems = [
  {
    icon: Mail,
    label: "Email us",
    value: "support@laptopanalyzer.com",
    href: "mailto:support@laptopanalyzer.com",
  },
  { icon: Clock, label: "Response time", value: "Within 24–48 hours" },
  { icon: Globe, label: "Coverage", value: "Worldwide support" },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
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

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("contact-form", {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          website: honeypot, // honeypot field
        },
      });

      if (error) {
        const errorBody = typeof error === "object" && "context" in error
          ? await (error as any).context?.json?.().catch(() => null)
          : null;

        if (errorBody?.error === "Too many requests. Please try again later.") {
          toast({
            title: "Too many submissions",
            description: "Please wait a few minutes before trying again.",
            variant: "destructive",
          });
        } else if (errorBody?.errors) {
          setFormErrors(errorBody.errors);
        } else {
          toast({
            title: "Something went wrong",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Message sent",
        description: "We'll get back to you within 24–48 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setHoneypot("");
      setFormErrors({});
      setSelected(null);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClasses =
    "h-12 bg-background/60 border-border/70 transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/15";

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

      <main className="relative overflow-hidden pt-28 pb-24 md:pt-32">
        {/* Ambient background glows */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[520px] opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container relative mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex overflow-hidden rounded-[2rem] border border-border/70 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/30"
          >
            {/* Vertical brand rail (echoes the reference's left column) */}
            <div className="hidden lg:flex w-14 shrink-0 flex-col items-center justify-between border-r border-border/60 py-8">
              <span className="h-10 w-px bg-gradient-to-b from-transparent to-primary/50" />
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground"
                style={{ writingMode: "vertical-rl" }}
              >
                Laptop Analyzer · Support
              </span>
              <a
                href="mailto:support@laptopanalyzer.com"
                aria-label="Email support"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>

            {/* Main grid: form + animated visual */}
            <div className="grid flex-1 lg:grid-cols-2">
              {/* ══════════ Form side ══════════ */}
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    Drop a message
                  </span>
                  <span className="h-px w-10 bg-primary/50" />
                </div>

                <h1 className="mt-4 text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-foreground">
                  Contact us
                </h1>
                <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                  Whether you&apos;ve found a bug, have a question about your results,
                  want to suggest a feature, or need to make a privacy request — our
                  support team reviews every message and typically responds within
                  24–48 hours.
                </p>

                {/* Topic chips */}
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium text-foreground">
                    What&apos;s this about?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat, i) => {
                      const active = selected === i;
                      return (
                        <button
                          key={cat.title}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setSelected(i);
                            setFormData((p) => ({ ...p, subject: cat.title }));
                            if (formErrors.subject) {
                              setFormErrors((p) => ({ ...p, subject: "" }));
                            }
                          }}
                          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            active
                              ? "border-primary/50 bg-primary/10 text-foreground"
                              : "border-border/70 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {active ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                          ) : (
                            <cat.icon className="h-4 w-4" aria-hidden="true" />
                          )}
                          {cat.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Honeypot field — hidden from users, catches bots */}
                  <div
                    className="absolute h-0 w-0 overflow-hidden opacity-0"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="sr-only">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className={`${fieldClasses} ${formErrors.name ? "border-destructive" : ""}`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-destructive">{formErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="sr-only">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={254}
                        className={`${fieldClasses} ${formErrors.email ? "border-destructive" : ""}`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="sr-only">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      className={`${fieldClasses} ${formErrors.subject ? "border-destructive" : ""}`}
                    />
                    {formErrors.subject && (
                      <p className="text-xs text-destructive">{formErrors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="sr-only">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message…"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      maxLength={5000}
                      className={`resize-none bg-background/60 border-border/70 transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/15 ${
                        formErrors.message ? "border-destructive" : ""
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      {formErrors.message ? (
                        <p className="text-xs text-destructive">{formErrors.message}</p>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">
                          Please don&apos;t share passwords or financial details.
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground/60">
                        {formData.message.length}/5000
                      </span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      variant="hero"
                      className="group h-12 w-full text-sm font-semibold tracking-wide"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Sending…
                        </span>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          Submit
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>

              {/* ══════════ Animated visual side ══════════ */}
              <div className="relative hidden min-h-[560px] flex-col overflow-hidden border-l border-border/60 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.05] lg:flex">
                {/* Message hub with the four support topics orbiting it */}
                <div className="relative flex flex-1 items-center justify-center">
                  <div className="relative h-[340px] w-[340px]" aria-hidden="true">
                    {/* Sweeping conic light */}
                    <motion.div
                      className="absolute inset-6 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary) / 0.16) 55deg, transparent 130deg)",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Expanding radar pings */}
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute inset-0 rounded-full border border-primary/20"
                        initial={{ scale: 0.42, opacity: 0.45 }}
                        animate={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: i * 1.33 }}
                      />
                    ))}

                    {/* Static orbit tracks */}
                    <div className="absolute inset-6 rounded-full border border-border/40" />
                    <div className="absolute inset-[4.75rem] rounded-full border border-border/25" />

                    {/* Orbiting layer — the whole ring revolves; icons counter-rotate to stay upright */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Spokes from the hub out to each topic */}
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 340 340" fill="none">
                        {[[170, 38], [302, 170], [170, 302], [38, 170]].map(([x, y], i) => (
                          <line
                            key={i}
                            x1="170"
                            y1="170"
                            x2={x}
                            y2={y}
                            stroke="hsl(var(--primary) / 0.22)"
                            strokeWidth="1"
                            strokeDasharray="2 6"
                          />
                        ))}
                      </svg>

                      {categories.map((cat, i) => {
                        const angle = i * 90;
                        const radius = 132;
                        return (
                          <div
                            key={cat.title}
                            className="absolute left-1/2 top-1/2"
                            style={{
                              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
                            }}
                          >
                            <motion.div
                              animate={{ rotate: -360 }}
                              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card/90 shadow-lg shadow-black/20"
                            >
                              <cat.icon className="h-6 w-6 text-primary" />
                            </motion.div>
                          </div>
                        );
                      })}
                    </motion.div>

                    {/* Central hub */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 0px hsl(var(--primary) / 0.3)",
                            "0 0 0 22px hsl(var(--primary) / 0)",
                          ],
                        }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                        className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/20"
                      >
                        <MessageSquare className="h-10 w-10 text-primary-foreground" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Contact details (compact corner row) */}
                <div className="relative border-t border-border/60 bg-background/30 px-8 py-6">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                    {infoItems.map((item) =>
                      item.href ? (
                        <a
                          key={item.label}
                          href={item.href}
                          className="inline-flex items-center gap-2.5 font-medium text-foreground transition-colors hover:text-primary"
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {item.value}
                        </a>
                      ) : (
                        <span
                          key={item.label}
                          className="inline-flex items-center gap-2.5 text-muted-foreground"
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {item.value}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact details for mobile (visual panel is desktop-only) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 rounded-2xl border border-border/70 bg-card/50 p-5 lg:hidden"
          >
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
              {infoItems.map((item) =>
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2.5 font-medium text-foreground transition-colors hover:text-primary"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item.value}
                  </a>
                ) : (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2.5 text-muted-foreground"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item.value}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
