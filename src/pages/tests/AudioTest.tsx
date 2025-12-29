import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX, Play, Square, Music } from "lucide-react";

const AudioTest = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const musicTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const playTone = (channel: "left" | "right" | "both", frequency: number = 440) => {
    stopTone();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const panner = audioContext.createStereoPanner();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.3;

    if (channel === "left") {
      panner.pan.value = -1;
    } else if (channel === "right") {
      panner.pan.value = 1;
    } else {
      panner.pan.value = 0;
    }

    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(audioContext.destination);

    oscillatorRef.current = oscillator;
    pannerRef.current = panner;

    oscillator.start();
    setIsPlaying(channel);
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    musicTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    musicTimeoutRef.current = [];
    setIsPlaying(null);
  };

  const playMusic = (musicType: string) => {
    stopTone();
    
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    
    // "How You Like That" inspired beat pattern (synthesized)
    const notes = musicType === "blackpink" ? [
      { freq: 392, duration: 0.2, delay: 0 },      // G4
      { freq: 392, duration: 0.2, delay: 0.25 },   // G4
      { freq: 440, duration: 0.2, delay: 0.5 },    // A4
      { freq: 392, duration: 0.2, delay: 0.75 },   // G4
      { freq: 349, duration: 0.4, delay: 1.0 },    // F4
      { freq: 330, duration: 0.3, delay: 1.5 },    // E4
      { freq: 294, duration: 0.3, delay: 1.85 },   // D4
      { freq: 330, duration: 0.4, delay: 2.2 },    // E4
      { freq: 392, duration: 0.2, delay: 2.7 },    // G4
      { freq: 392, duration: 0.2, delay: 2.95 },   // G4
      { freq: 440, duration: 0.2, delay: 3.2 },    // A4
      { freq: 494, duration: 0.4, delay: 3.45 },   // B4
      { freq: 523, duration: 0.5, delay: 3.9 },    // C5
      { freq: 494, duration: 0.3, delay: 4.5 },    // B4
      { freq: 440, duration: 0.3, delay: 4.85 },   // A4
      { freq: 392, duration: 0.5, delay: 5.2 },    // G4
    ] : [
      { freq: 523, duration: 0.3, delay: 0 },
      { freq: 587, duration: 0.3, delay: 0.35 },
      { freq: 659, duration: 0.3, delay: 0.7 },
      { freq: 698, duration: 0.5, delay: 1.05 },
    ];

    setIsPlaying(`music-${musicType}`);
    
    notes.forEach((note) => {
      const timeout = setTimeout(() => {
        if (!audioContextRef.current) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = "square";
        oscillator.frequency.value = note.freq;
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + note.duration);
      }, note.delay * 1000);
      
      musicTimeoutRef.current.push(timeout);
    });

    // Auto stop after melody ends
    const endTimeout = setTimeout(() => {
      setIsPlaying(null);
    }, 6000);
    musicTimeoutRef.current.push(endTimeout);
  };

  const frequencies = [
    { label: "Low (220 Hz)", value: 220 },
    { label: "Mid (440 Hz)", value: 440 },
    { label: "High (880 Hz)", value: 880 },
    { label: "Very High (1760 Hz)", value: 1760 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Speaker & Audio Test
            </h1>
            <p className="text-muted-foreground">
              Test your left and right speakers with various tones and frequencies.
            </p>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Button
              size="lg"
              onClick={() => playTone("both")}
              className="h-14 px-8 text-lg font-semibold gap-3"
            >
              <Volume2 className="h-5 w-5" />
              Start Audio Test
            </Button>
          </motion.div>

          {/* Stereo Test */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <h3 className="font-semibold text-foreground mb-6">Stereo Speaker Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Speaker */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isPlaying === "left"
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
                onClick={() => (isPlaying === "left" ? stopTone() : playTone("left"))}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    isPlaying === "left" ? "bg-primary animate-pulse" : "bg-muted"
                  }`}>
                    <Volume2 className={`h-8 w-8 ${isPlaying === "left" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Left Speaker</h4>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying === "left" ? "Playing..." : "Click to test"}
                  </p>
                </div>
              </motion.div>

              {/* Both Speakers */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isPlaying === "both"
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
                onClick={() => (isPlaying === "both" ? stopTone() : playTone("both"))}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    isPlaying === "both" ? "bg-primary animate-pulse" : "bg-muted"
                  }`}>
                    <div className="flex gap-1">
                      <Volume2 className={`h-6 w-6 ${isPlaying === "both" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <Volume2 className={`h-6 w-6 ${isPlaying === "both" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Both Speakers</h4>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying === "both" ? "Playing..." : "Click to test"}
                  </p>
                </div>
              </motion.div>

              {/* Right Speaker */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isPlaying === "right"
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
                onClick={() => (isPlaying === "right" ? stopTone() : playTone("right"))}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    isPlaying === "right" ? "bg-primary animate-pulse" : "bg-muted"
                  }`}>
                    <Volume2 className={`h-8 w-8 ${isPlaying === "right" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Right Speaker</h4>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying === "right" ? "Playing..." : "Click to test"}
                  </p>
                </div>
              </motion.div>
            </div>

            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <Button variant="destructive" onClick={stopTone}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Audio
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Frequency Test */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold text-foreground mb-6">Frequency Range Test</h3>
            <p className="text-muted-foreground mb-6">
              Test different frequencies to check your speaker's range. Higher frequencies test the tweeters, lower frequencies test the woofers.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {frequencies.map((freq) => (
                <Button
                  key={freq.value}
                  variant={isPlaying === `freq-${freq.value}` ? "hero" : "outline"}
                  className="h-auto py-4 flex-col"
                  onClick={() => {
                    if (isPlaying === `freq-${freq.value}`) {
                      stopTone();
                    } else {
                      stopTone();
                      playTone("both", freq.value);
                      setIsPlaying(`freq-${freq.value}`);
                    }
                  }}
                >
                  <span className="text-lg font-bold">{freq.value} Hz</span>
                  <span className="text-xs opacity-70">{freq.label.split(" ")[0]}</span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Music Test */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-card rounded-2xl p-6 mt-8"
          >
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Music Test - How You Like That
            </h3>
            <p className="text-muted-foreground mb-6">
              Test your speakers with a catchy melody inspired by Blackpink's hit song.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                variant={isPlaying === "music-blackpink" ? "hero" : "outline"}
                className="h-auto py-4 px-6 flex items-center gap-3"
                onClick={() => {
                  if (isPlaying === "music-blackpink") {
                    stopTone();
                  } else {
                    playMusic("blackpink");
                  }
                }}
              >
                {isPlaying === "music-blackpink" ? (
                  <>
                    <Square className="h-5 w-5" />
                    <div className="text-left">
                      <span className="block font-bold">Stop Music</span>
                      <span className="text-xs opacity-70">Playing...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <div className="text-left">
                      <span className="block font-bold">How You Like That</span>
                      <span className="text-xs opacity-70">BLACKPINK Style</span>
                    </div>
                  </>
                )}
              </Button>
            </div>
            
            {isPlaying === "music-blackpink" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: [8, 24, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-primary font-medium">♪ Playing melody...</span>
              </motion.div>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="font-semibold text-foreground mb-3">Testing Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Make sure your volume is at a comfortable level before testing</li>
              <li>• Left speaker test should only produce sound from the left side</li>
              <li>• Right speaker test should only produce sound from the right side</li>
              <li>• If you can't hear certain frequencies, it might indicate speaker issues</li>
              <li>• The music test helps verify both speakers work together with dynamic audio</li>
            </ul>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AudioTest;
