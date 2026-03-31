import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Send, HelpCircle, Bug, Lightbulb, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";

const cats = [
  { icon: HelpCircle, label: "Support", color: "from-primary to-accent" },
  { icon: Bug, label: "Bug Report", color: "from-destructive to-warning" },
  { icon: Lightbulb, label: "Feature Idea", color: "from-warning to-[hsl(45,90%,55%)]" },
  { icon: Shield, label: "Privacy", color: "from-success to-accent" },
];

const Contact = () => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Sent", description: "We'll reply within 24–48 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
    setSel(null);
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact - LaptopAnalyzer"
        description="Reach the Laptop Analyzer team for support, bugs, ideas, or privacy questions."
        keywords="contact laptopanalyzer, support, bug report, feature request"
        canonicalPath="/contact"
      />
      <Header />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-xl">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Get in Touch</h1>
            <p className="text-muted-foreground mt-2 text-sm">Support, bugs, ideas, or privacy — we're here.</p>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-2 justify-center mb-8">
            {cats.map((c, i) => {
              const on = sel === i;
              return (
                <button
                  key={i}
                  onClick={() => { setSel(i); setForm((p) => ({ ...p, subject: c.label })); }}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    on ? "border-primary/50 bg-primary/[0.06] text-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25 hover:text-foreground"
                  }`}
                >
                  <span className={`inline-flex p-1 rounded bg-gradient-to-br ${c.color}`}>
                    <c.icon className="h-3 w-3 text-primary-foreground" />
                  </span>
                  {c.label}
                  {on && <CheckCircle2 className="h-3 w-3 text-primary ml-0.5" />}
                </button>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-card border border-border p-6">
            <form onSubmit={submit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[11px]">Name</Label>
                  <Input id="name" name="name" placeholder="Jane Doe" value={form.name} onChange={update} required className="h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[11px]">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={update} required className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject" className="text-[11px]">Subject</Label>
                <Input id="subject" name="subject" placeholder="What's this about?" value={form.subject} onChange={update} required className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message" className="text-[11px]">Message</Label>
                <Textarea id="message" name="message" placeholder="How can we help?" rows={4} value={form.message} onChange={update} required className="text-sm" />
              </div>
              <Button type="submit" variant="hero" className="w-full h-10 text-sm font-semibold" disabled={busy}>
                {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Send className="h-3.5 w-3.5 mr-1.5" />Send Message</>}
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
              We reply within 24–48 hrs · Avoid sending sensitive financial info
            </p>
          </motion.div>

          {/* Footer info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-center text-[11px] text-muted-foreground/70 space-y-1">
            <p>support@laptopanalyzer.com · Worldwide · 24–48 hr response</p>
            <p>
              Quick answers? <a href="/#faq" className="text-primary hover:underline">Visit FAQ →</a>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
