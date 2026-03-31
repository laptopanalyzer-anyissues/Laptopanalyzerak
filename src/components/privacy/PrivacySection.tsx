import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PrivacySectionProps {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  highlight?: boolean;
  id?: string;
}

export function PrivacyPolicySection({ icon: Icon, title, children, highlight, id }: PrivacySectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className={`p-6 md:p-8 rounded-2xl border transition-colors duration-200 ${
        highlight 
          ? 'bg-primary/[0.03] border-primary/20' 
          : 'bg-card border-border hover:border-primary/10'
      }`}
    >
      <div className="flex items-start gap-3 mb-5">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-tight pt-1.5">
          {title}
        </h2>
      </div>
      <div className="text-muted-foreground leading-relaxed space-y-4 pl-0 md:pl-[52px]">
        {children}
      </div>
    </motion.section>
  );
}

interface BulletProps {
  title?: string;
  children: ReactNode;
}

export function Bullet({ title, children }: BulletProps) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
      <span>
        {title && <strong className="text-foreground">{title}: </strong>}
        {children}
      </span>
    </li>
  );
}

interface CalloutProps {
  children: ReactNode;
  variant?: 'info' | 'trust' | 'local';
}

export function Callout({ children, variant = 'info' }: CalloutProps) {
  const styles = {
    trust: 'bg-success/5 border border-success/15 text-success/90',
    local: 'bg-accent/40 border border-accent/60 text-foreground/80',
    info: 'bg-primary/5 border border-primary/15 text-muted-foreground',
  };

  return (
    <div className={`rounded-xl p-4 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}
