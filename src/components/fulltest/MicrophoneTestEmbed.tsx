import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, CheckCircle2, ArrowLeft } from "lucide-react";

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const MicrophoneTestEmbed = ({ onComplete, onBack }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState("");
  const [peakVolume, setPeakVolume] = useState(0);
  
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);

  const startListening = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      visualize();
    } catch {
      setError("Microphone access denied.");
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const vol = Math.round((avg / 255) * 100);
      setVolume(vol);
      setPeakVolume(prev => Math.max(prev, vol));
    };
    draw();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const canComplete = peakVolume > 10; // Detected some sound

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
          <Mic className="h-4 w-4" />
          <span className="font-medium">Microphone Test</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Speak or make sounds to test your microphone
        </p>
      </div>

      {/* Mic Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {!isListening && !error && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Mic className="h-12 w-12 text-muted-foreground" />
            </div>
            <Button onClick={startListening}>
              <Mic className="h-4 w-4 mr-2" />
              Start Microphone
            </Button>
          </div>
        )}

        {error && (
          <div className="text-center">
            <MicOff className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {isListening && (
          <div className="w-full max-w-sm">
            {/* Visual Volume Indicator */}
            <motion.div
              className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6"
              animate={{ scale: 1 + (volume / 200) }}
            >
              <div className="w-20 h-20 rounded-full bg-primary/40 flex items-center justify-center">
                <Mic className="h-8 w-8 text-primary" />
              </div>
            </motion.div>

            {/* Volume Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Volume Level</span>
                <span className="text-sm font-medium">{volume}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  animate={{ width: `${volume}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Peak volume: {peakVolume}%
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        {onBack && (
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button onClick={onComplete} disabled={!isListening}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {canComplete ? "Complete Test" : "Make some sound first"}
        </Button>
      </div>
    </div>
  );
};

export default MicrophoneTestEmbed;
