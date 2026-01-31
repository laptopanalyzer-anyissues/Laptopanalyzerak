import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { ArrowLeft, Volume2, VolumeX, Play, Square, Music, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import howYouLikeThatAudio from "@/assets/audio/how-you-like-that.mp3";

const AudioTest = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [testedChannels, setTestedChannels] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAll();
    };
  }, []);

  const stopAll = () => {
    // Stop oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    // Stop audio element
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    // Disconnect source node
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    // Close audio context
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

    if (channel === "left") {
      panner.pan.value = -1;
    } else if (channel === "right") {
      panner.pan.value = 1;
    } else {
      panner.pan.value = 0;
    }

    source.connect(panner);
    panner.connect(audioContext.destination);

    audio.play();
    setIsPlaying(channel);
    setTestedChannels(prev => new Set(prev).add(channel));

    audio.onended = () => {
      setIsPlaying(null);
    };
  };

  const playFrequencyTone = (frequency: number) => {
    stopAll();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.3;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillatorRef.current = oscillator;

    oscillator.start();
    setIsPlaying(`freq-${frequency}`);
  };

  const frequencies = [
    { label: "Low (220 Hz)", value: 220 },
    { label: "Mid (440 Hz)", value: 440 },
    { label: "High (880 Hz)", value: 880 },
    { label: "Very High (1760 Hz)", value: 1760 },
  ];

  const canComplete = testedChannels.size >= 1;

  const handleCompleteClick = () => {
    stopAll();
    setShowConfirmDialog(true);
  };

  const handleConfirmResponse = (allWorking: boolean) => {
    setShowConfirmDialog(false);
    setTestResult(allWorking);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Speaker Test Online - Test Left & Right Audio Free 2026"
        description="Free speaker test online! Check left and right speaker audio, test laptop speakers, headphones & earbuds. Stereo audio test with music and frequency tones."
        keywords="speaker test, speaker test online, audio test, stereo test, left right speaker test, laptop speaker test, headphone test, sound test, audio output test, speaker checker"
        canonicalPath="/test/audio"
        structuredData={structuredData.howTo(
          "How to Test Your Speakers Online",
          "Use our free speaker test to verify left and right audio channels work correctly.",
          [
            { name: "Start audio test", text: "Click Start Audio Test to play through both speakers" },
            { name: "Test left speaker", text: "Click Left Speaker to verify left channel" },
            { name: "Test right speaker", text: "Click Right Speaker to verify right channel" },
            { name: "Try frequency tones", text: "Test different frequencies to check speaker range" },
          ]
        )}
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirmDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full max-w-md mx-4 p-8 rounded-2xl bg-card border border-border shadow-2xl text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Volume2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Speaker Test Complete
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Did all speakers work correctly? Could you hear audio from left, right, and both channels?
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleConfirmResponse(false)}
                      className="gap-2 border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No, Issues Found
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleConfirmResponse(true)}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes, All Working
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Speaker & Audio Test
            </h1>
            <p className="text-muted-foreground">
              Test your left and right speakers with music and various frequencies.
            </p>
          </motion.div>

          {/* Test Result Banner */}
          {testResult !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-4 rounded-xl flex items-center justify-center gap-3 ${
                testResult ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/20"
              }`}
            >
              {testResult ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium text-success">All speakers are working correctly!</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-5 w-5 text-warning" />
                  <span className="font-medium text-warning">Issues detected with speakers</span>
                </>
              )}
            </motion.div>
          )}

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 flex justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => playMusicWithPan("both")}
              className="h-14 px-8 text-lg font-semibold gap-3"
            >
              <Volume2 className="h-5 w-5" />
              Start Audio Test
            </Button>
            {canComplete && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleCompleteClick}
                className="h-14 px-8 text-lg font-semibold gap-3"
              >
                <CheckCircle2 className="h-5 w-5" />
                Complete Test
              </Button>
            )}
          </motion.div>

          {/* Stereo Test */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <h3 className="font-semibold text-foreground mb-2">Stereo Speaker Test</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Test each speaker with music - click to play through left, right, or both speakers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Speaker */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isPlaying === "left"
                    ? "bg-primary/10 border-primary"
                    : testedChannels.has("left")
                    ? "bg-success/10 border-success"
                    : "bg-card border-border hover:border-primary/50"
                }`}
                onClick={() => (isPlaying === "left" ? stopAll() : playMusicWithPan("left"))}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    isPlaying === "left" ? "bg-primary animate-pulse" : "bg-muted"
                  }`}>
                    <Volume2 className={`h-8 w-8 ${isPlaying === "left" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Left Speaker</h4>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying === "left" ? "♪ Playing music..." : "Click to test"}
                  </p>
                  {testedChannels.has("left") && !isPlaying && <CheckCircle2 className="h-4 w-4 text-success mx-auto mt-2" />}
                </div>
              </motion.div>

              {/* Both Speakers */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isPlaying === "both"
                    ? "bg-primary/10 border-primary"
                    : testedChannels.has("both")
                    ? "bg-success/10 border-success"
                    : "bg-card border-border hover:border-primary/50"
                }`}
                onClick={() => (isPlaying === "both" ? stopAll() : playMusicWithPan("both"))}
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
                    {isPlaying === "both" ? "♪ Playing music..." : "Click to test"}
                  </p>
                  {testedChannels.has("both") && !isPlaying && <CheckCircle2 className="h-4 w-4 text-success mx-auto mt-2" />}
                </div>
              </motion.div>

              {/* Right Speaker */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isPlaying === "right"
                    ? "bg-primary/10 border-primary"
                    : testedChannels.has("right")
                    ? "bg-success/10 border-success"
                    : "bg-card border-border hover:border-primary/50"
                }`}
                onClick={() => (isPlaying === "right" ? stopAll() : playMusicWithPan("right"))}
              >
                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-full mb-4 ${
                    isPlaying === "right" ? "bg-primary animate-pulse" : "bg-muted"
                  }`}>
                    <Volume2 className={`h-8 w-8 ${isPlaying === "right" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Right Speaker</h4>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying === "right" ? "♪ Playing music..." : "Click to test"}
                  </p>
                  {testedChannels.has("right") && !isPlaying && <CheckCircle2 className="h-4 w-4 text-success mx-auto mt-2" />}
                </div>
              </motion.div>
            </div>

            {isPlaying && !isPlaying.startsWith("freq-") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <Button variant="destructive" onClick={stopAll}>
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
                      stopAll();
                    } else {
                      playFrequencyTone(freq.value);
                    }
                  }}
                >
                  <span className="text-lg font-bold">{freq.value} Hz</span>
                  <span className="text-xs opacity-70">{freq.label.split(" ")[0]}</span>
                </Button>
              ))}
            </div>

            {isPlaying?.startsWith("freq-") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <Button variant="destructive" onClick={stopAll}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Tone
                </Button>
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
