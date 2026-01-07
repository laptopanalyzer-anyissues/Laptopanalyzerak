import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, Square, CheckCircle2, ArrowLeft } from "lucide-react";
import howYouLikeThatAudio from "@/assets/audio/how-you-like-that.mp3";

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const AudioTestEmbed = ({ onComplete, onBack }: Props) => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [testedChannels, setTestedChannels] = useState<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const stopAll = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    pannerRef.current = null;
    setIsPlaying(null);
  };

  const playMusicWithPan = (channel: "left" | "right" | "both") => {
    stopAll();
    
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const audio = new Audio(howYouLikeThatAudio);
    audioElementRef.current = audio;

    const source = audioContext.createMediaElementSource(audio);
    sourceNodeRef.current = source;

    const panner = audioContext.createStereoPanner();
    pannerRef.current = panner;

    if (channel === "left") panner.pan.value = -1;
    else if (channel === "right") panner.pan.value = 1;
    else panner.pan.value = 0;

    source.connect(panner);
    panner.connect(audioContext.destination);

    audio.play();
    setIsPlaying(channel);
    setTestedChannels(prev => new Set(prev).add(channel));

    audio.onended = () => setIsPlaying(null);
    
    // Auto stop after 30 seconds
    setTimeout(() => {
      if (audioElementRef.current) {
        stopAll();
      }
    }, 30000);
  };

  const canComplete = testedChannels.size >= 1;

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
          <Volume2 className="h-4 w-4" />
          <span className="font-medium">Speaker Test</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Test your left and right speakers
        </p>
      </div>

      {/* Speaker Cards */}
      <div className="flex-1 grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
        {/* Left Speaker */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
            isPlaying === "left"
              ? "bg-primary/10 border-primary"
              : testedChannels.has("left")
              ? "bg-success/10 border-success"
              : "bg-card border-border hover:border-primary/50"
          }`}
          onClick={() => (isPlaying === "left" ? stopAll() : playMusicWithPan("left"))}
        >
          <div className={`p-3 rounded-full mb-3 ${isPlaying === "left" ? "bg-primary animate-pulse" : "bg-muted"}`}>
            <Volume2 className={`h-6 w-6 ${isPlaying === "left" ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </div>
          <span className="font-medium text-foreground text-sm">Left</span>
          {testedChannels.has("left") && !isPlaying && <CheckCircle2 className="h-4 w-4 text-success mt-2" />}
        </motion.div>

        {/* Both Speakers */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
            isPlaying === "both"
              ? "bg-primary/10 border-primary"
              : testedChannels.has("both")
              ? "bg-success/10 border-success"
              : "bg-card border-border hover:border-primary/50"
          }`}
          onClick={() => (isPlaying === "both" ? stopAll() : playMusicWithPan("both"))}
        >
          <div className={`p-3 rounded-full mb-3 ${isPlaying === "both" ? "bg-primary animate-pulse" : "bg-muted"}`}>
            <div className="flex gap-0.5">
              <Volume2 className={`h-5 w-5 ${isPlaying === "both" ? "text-primary-foreground" : "text-muted-foreground"}`} />
              <Volume2 className={`h-5 w-5 ${isPlaying === "both" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
          </div>
          <span className="font-medium text-foreground text-sm">Both</span>
          {testedChannels.has("both") && !isPlaying && <CheckCircle2 className="h-4 w-4 text-success mt-2" />}
        </motion.div>

        {/* Right Speaker */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
            isPlaying === "right"
              ? "bg-primary/10 border-primary"
              : testedChannels.has("right")
              ? "bg-success/10 border-success"
              : "bg-card border-border hover:border-primary/50"
          }`}
          onClick={() => (isPlaying === "right" ? stopAll() : playMusicWithPan("right"))}
        >
          <div className={`p-3 rounded-full mb-3 ${isPlaying === "right" ? "bg-primary animate-pulse" : "bg-muted"}`}>
            <Volume2 className={`h-6 w-6 ${isPlaying === "right" ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </div>
          <span className="font-medium text-foreground text-sm">Right</span>
          {testedChannels.has("right") && !isPlaying && <CheckCircle2 className="h-4 w-4 text-success mt-2" />}
        </motion.div>
      </div>

      {isPlaying && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" onClick={stopAll}>
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        {onBack && (
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button onClick={onComplete} disabled={!canComplete}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {canComplete ? "Complete Test" : "Test at least one speaker"}
        </Button>
      </div>
    </div>
  );
};

export default AudioTestEmbed;
