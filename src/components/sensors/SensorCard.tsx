import { motion } from "framer-motion";
import { Check, X, AlertTriangle, HelpCircle, Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SensorStatus } from "@/hooks/use-sensor-detection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SensorCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  status: SensorStatus;
  value?: string;
  details?: string;
  description: string;
  index: number;
}

const statusConfig: Record<SensorStatus, { 
  label: string; 
  icon: LucideIcon; 
  bgClass: string;
  badgeClass: string;
}> = {
  "not-tested": { 
    label: "Waiting", 
    icon: HelpCircle, 
    bgClass: "bg-muted/30",
    badgeClass: "bg-muted text-muted-foreground"
  },
  "testing": { 
    label: "Testing...", 
    icon: Loader2, 
    bgClass: "bg-primary/5 border-primary/20",
    badgeClass: "bg-primary/20 text-primary"
  },
  "available": { 
    label: "Working", 
    icon: Check, 
    bgClass: "bg-success/10 border-success/30",
    badgeClass: "bg-success/20 text-success"
  },
  "limited": { 
    label: "Limited", 
    icon: AlertTriangle, 
    bgClass: "bg-warning/10 border-warning/30",
    badgeClass: "bg-warning/20 text-warning"
  },
  "not-available": { 
    label: "Not Present", 
    icon: X, 
    bgClass: "bg-muted/20",
    badgeClass: "bg-muted text-muted-foreground"
  },
  "not-supported": { 
    label: "Not Supported", 
    icon: X, 
    bgClass: "bg-muted/10",
    badgeClass: "bg-muted/50 text-muted-foreground"
  },
};

export function SensorCard({ 
  id, 
  name, 
  icon: Icon, 
  status, 
  value, 
  details, 
  description,
  index 
}: SensorCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03 }}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border transition-all",
        config.bgClass
      )}
    >
      {/* Icon */}
      <div className={cn(
        "p-2.5 rounded-lg shrink-0",
        status === "available" ? "bg-success/20" : 
        status === "limited" ? "bg-warning/20" : 
        status === "testing" ? "bg-primary/20" : "bg-muted"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          status === "available" ? "text-success" : 
          status === "limited" ? "text-warning" : 
          status === "testing" ? "text-primary" : "text-foreground"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground text-sm">{name}</span>
          {details && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">{details}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {value || description}
        </p>
      </div>

      {/* Status Badge */}
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
        config.badgeClass
      )}>
        <StatusIcon className={cn(
          "h-3.5 w-3.5",
          status === "testing" && "animate-spin"
        )} />
        <span className="hidden sm:inline">{config.label}</span>
      </div>
    </motion.div>
  );
}
