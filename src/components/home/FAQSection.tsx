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
    question: "Is this tool completely free?",
    answer: "Yes! LaptopAnalyzer is 100% free to use. All diagnostic tests run directly in your browser with no hidden costs, subscriptions, or premium features."
  },
  {
    question: "Is my data safe? Do you store any information?",
    answer: "Absolutely. All tests run locally in your browser. We don't collect, store, or transmit any of your hardware data. Your privacy is completely protected."
  },
  {
    question: "Why isn't my camera/microphone working in the test?",
    answer: "Your browser needs permission to access these devices. When prompted, click 'Allow' to grant access. If you previously denied permission, check your browser settings to enable it."
  },
  {
    question: "Why isn't the fn key or F11 working on my Mac keyboard test?",
    answer: "The fn key is a hardware-level modifier that browsers cannot detect — it's intercepted by your keyboard firmware before reaching the browser. For F11 (and sometimes F12), macOS intercepts these keys for Mission Control features like 'Show Desktop'. To test F11, press fn + F11 together, or go to System Preferences → Keyboard and enable 'Use F1, F2, etc. keys as standard function keys'."
  },
  {
    question: "What should I do if I find dead pixels?",
    answer: "If your laptop is under warranty, contact the manufacturer as dead pixels may be covered. Some stuck pixels can be fixed using pixel-fixing videos that rapidly flash colors, but dead pixels typically require screen replacement."
  },
  {
    question: "Why is my network speed test showing slow results?",
    answer: "Several factors affect speed: WiFi signal strength, network congestion, distance from router, or ISP throttling. Try testing on a wired connection or closer to your router for accurate results."
  },
  {
    question: "Can I use this tool on a desktop computer?",
    answer: "Yes! While designed for laptops, all tests work on desktop computers too. Some tests like touchpad won't apply, but display, keyboard, audio, and network tests work perfectly."
  },
  {
    question: "How accurate are the diagnostic results?",
    answer: "Our tests use standard web APIs and are highly accurate for detecting common hardware issues. However, for deep hardware diagnostics (like checking SSD health or CPU temperature), specialized software may be needed."
  },
  {
    question: "Do I need to install anything?",
    answer: "No installation required! LaptopAnalyzer runs entirely in your web browser. Just visit the site and start testing immediately."
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Find solutions to common issues and learn more about how LaptopAnalyzer works.
          </p>
        </motion.div>

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