import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is Laptop Analyzer free?",
    answer: "Yes — completely free with no hidden costs, subscriptions, or premium tiers. Tests run directly in your browser."
  },
  {
    question: "Is my data safe?",
    answer: "Hardware tests run locally in your browser. We don't store your test results, and we've designed the tool to minimize unnecessary data handling."
  },
  {
    question: "Why isn't my camera or microphone working?",
    answer: "Your browser needs permission to access these devices. Click 'Allow' when prompted. If you previously denied access, check your browser's site settings."
  },
  {
    question: "Why isn't fn or F11 working on Mac?",
    answer: "The fn key is hardware-level and invisible to browsers. For F11, macOS intercepts it for Mission Control. Press fn + F11 together, or enable 'Use F1, F2, etc. as standard function keys' in System Preferences → Keyboard."
  },
  {
    question: "What should I do about dead pixels?",
    answer: "If under warranty, contact your manufacturer — dead pixels may be covered. Stuck pixels can sometimes be fixed with pixel-cycling tools, but dead pixels usually require a screen replacement."
  },
  {
    question: "Why is my speed test slow?",
    answer: "WiFi signal, distance from router, network congestion, and ISP throttling all affect results. Try a wired connection for the most accurate measurement."
  },
  {
    question: "Does this work on desktops?",
    answer: "Yes. While designed for laptops, all tests work on desktop computers. Some tests like touchpad won't apply, but display, keyboard, audio, and network work perfectly."
  },
  {
    question: "How accurate are the results?",
    answer: "Our tests use standard Web APIs and are reliable for detecting common hardware issues. For deeper diagnostics like SSD health or CPU thermals, dedicated software is needed."
  },
  {
    question: "Do I need to install anything?",
    answer: "No. Laptop Analyzer runs entirely in your browser — just open the site and start testing."
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20" id="faq" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>FAQ</span>
          </div>
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Common Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick answers about how Laptop Analyzer works.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-semibold text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};