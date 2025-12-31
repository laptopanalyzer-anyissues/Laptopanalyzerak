import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mouse, CheckCircle2 } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const TouchpadTestEmbed = ({ onComplete }: Props) => {
  const [leftClicks, setLeftClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);
  const [scrollEvents, setScrollEvents] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const trackingAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPosition({ x, y });
    setTrail((prev) => [...prev.slice(-15), { x, y }]);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) setLeftClicks((prev) => prev + 1);
    else if (e.button === 2) setRightClicks((prev) => prev + 1);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setRightClicks((prev) => prev + 1);
  };

  const handleScroll = () => {
    setScrollEvents((prev) => prev + 1);
  };

  const hasInteracted = leftClicks > 0 || trail.length > 5;

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
          <Mouse className="h-4 w-4" />
          <span className="font-medium">Touchpad Test</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Move, click, and scroll in the area below
        </p>
      </div>

      {/* Tracking Area */}
      <div className="flex-1 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div
            ref={trackingAreaRef}
            className="relative h-full min-h-[200px] bg-muted rounded-xl overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onWheel={handleScroll}
          >
            {/* Grid */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-border/20" />
              ))}
            </div>

            {/* Cursor Trail */}
            {trail.map((point, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary pointer-events-none"
                style={{ left: point.x - 4, top: point.y - 4 }}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              />
            ))}

            {/* Current Position */}
            <div
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: cursorPosition.x, top: cursorPosition.y }}
            >
              <div className="w-full h-full rounded-full border-2 border-primary bg-primary/20 animate-pulse" />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-background/80 text-xs text-muted-foreground">
              Move • Click • Scroll
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className={`p-3 rounded-xl ${leftClicks > 0 ? "bg-success/10" : "bg-muted"}`}>
            <div className="flex items-center gap-2">
              {leftClicks > 0 && <CheckCircle2 className="h-4 w-4 text-success" />}
              <span className="text-sm text-foreground">Left Click</span>
            </div>
            <span className="text-xl font-bold text-foreground">{leftClicks}</span>
          </div>
          <div className={`p-3 rounded-xl ${rightClicks > 0 ? "bg-success/10" : "bg-muted"}`}>
            <div className="flex items-center gap-2">
              {rightClicks > 0 && <CheckCircle2 className="h-4 w-4 text-success" />}
              <span className="text-sm text-foreground">Right Click</span>
            </div>
            <span className="text-xl font-bold text-foreground">{rightClicks}</span>
          </div>
          <div className={`p-3 rounded-xl ${scrollEvents > 0 ? "bg-success/10" : "bg-muted"}`}>
            <div className="flex items-center gap-2">
              {scrollEvents > 0 && <CheckCircle2 className="h-4 w-4 text-success" />}
              <span className="text-sm text-foreground">Scroll</span>
            </div>
            <span className="text-xl font-bold text-foreground">{scrollEvents}</span>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="mt-4 text-center">
        <Button onClick={onComplete} disabled={!hasInteracted}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {hasInteracted ? "Complete Test" : "Interact with the area first"}
        </Button>
      </div>
    </div>
  );
};

export default TouchpadTestEmbed;
