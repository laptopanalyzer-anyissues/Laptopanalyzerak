import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const pixelColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#00FF00" },
  { name: "Blue", hex: "#0000FF" },
];

const DisplayTestEmbed = ({ onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedAll, setViewedAll] = useState(false);

  useEffect(() => {
    if (currentIndex === pixelColors.length - 1) {
      setViewedAll(true);
    }
  }, [currentIndex]);

  const nextColor = () => {
    if (currentIndex < pixelColors.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevColor = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Test Display Area */}
      <div 
        className="flex-1 relative transition-colors duration-300"
        style={{ backgroundColor: pixelColors[currentIndex].hex }}
      >
        {/* Overlay Info */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-background/80 backdrop-blur-sm rounded-xl px-6 py-4 text-center"
          >
            <p className="text-sm text-muted-foreground mb-1">Dead Pixel Check</p>
            <p className="text-lg font-semibold text-foreground">{pixelColors[currentIndex].name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Look for any bright or dark spots
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-background border-t border-border">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevColor}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {pixelColors.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-primary" : i < currentIndex ? "bg-success" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {viewedAll ? (
            <Button size="sm" onClick={onComplete}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete Test
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={nextColor}
              disabled={currentIndex === pixelColors.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayTestEmbed;
