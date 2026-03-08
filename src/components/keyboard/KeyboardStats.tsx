import { motion } from "framer-motion";
import { Keyboard, Hash, CornerDownLeft, Code2 } from "lucide-react";

interface KeyboardStatsProps {
  progress: number;
  testedKeys: number;
  totalKeys: number;
  lastKey: string;
  lastKeyCode: string;
}

export const KeyboardStats = ({
  progress,
  testedKeys,
  totalKeys,
  lastKey,
  lastKeyCode,
}: KeyboardStatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
    >
      <StatCard
        icon={<Keyboard className="h-4 w-4" />}
        label="Progress"
        delay={0}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "hsl(222 30% 14%)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: progress === 100
                  ? "linear-gradient(90deg, hsl(142 76% 36%), hsl(142 60% 50%))"
                  : "linear-gradient(90deg, hsl(199 89% 48%), hsl(172 66% 50%))",
              }}
            />
          </div>
          <span className="text-sm font-bold text-foreground tabular-nums">{progress}%</span>
        </div>
      </StatCard>

      <StatCard icon={<Hash className="h-4 w-4" />} label="Keys Tested" delay={0.05}>
        <p className="font-bold text-foreground text-lg tabular-nums">
          <span className="text-primary">{testedKeys}</span>
          <span className="text-muted-foreground font-normal text-sm"> / {totalKeys}</span>
        </p>
      </StatCard>

      <StatCard icon={<CornerDownLeft className="h-4 w-4" />} label="Last Key" delay={0.1}>
        <p className="font-bold text-foreground text-lg truncate">
          {lastKey || <span className="text-muted-foreground">—</span>}
        </p>
      </StatCard>

      <StatCard icon={<Code2 className="h-4 w-4" />} label="Key Code" delay={0.15}>
        <p className="font-bold text-foreground text-lg truncate font-mono text-sm">
          {lastKeyCode || <span className="text-muted-foreground">—</span>}
        </p>
      </StatCard>
    </motion.div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  delay: number;
}

const StatCard = ({ icon, label, children, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="p-4 rounded-xl bg-card border border-border/60 backdrop-blur-sm"
    style={{
      boxShadow: "0 2px 8px hsl(222 47% 4% / 0.1)",
    }}
  >
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    </div>
    {children}
  </motion.div>
);

export default KeyboardStats;
