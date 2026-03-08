import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { ArrowLeft, Mic, MicOff, Play, Square, Volume2 } from "lucide-react";

const MicrophoneTest = () => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [micInfo, setMicInfo] = useState<string>("");
  
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      // Get mic info
      const audioTrack = stream.getAudioTracks()[0];
      setMicInfo(audioTrack.label || "Unknown Microphone");

      setIsListening(true);
      visualize();
    } catch (err) {
      setError("Microphone access denied. Please allow microphone permissions.");
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsListening(false);
    setVolume(0);
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Calculate volume
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      setVolume(Math.round((avg / 255) * 100));

      // Draw waveform
      ctx.fillStyle = "hsl(210, 40%, 96%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, "hsl(199, 89%, 48%)");
        gradient.addColorStop(1, "hsl(172, 66%, 50%)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Microphone Test Online - Test Your Mic Free 2026"
        description="Free microphone test online! Check if your mic works with real-time audio visualization. Test laptop microphone, USB mic, headset mic for Zoom, Discord & gaming."
        keywords="microphone test, mic test, mic test online, microphone test online, test my mic, test microphone, laptop mic test, usb microphone test, headset mic test, audio input test"
        canonicalPath="/test/microphone"
        structuredData={structuredData.howTo(
          "How to Test Your Microphone Online",
          "Use our free mic tester to verify your microphone works for calls and recording.",
          [
            { name: "Allow microphone access", text: "Click Start Microphone and grant permission" },
            { name: "Speak into your mic", text: "Watch the volume meter respond to your voice" },
            { name: "Record a sample", text: "Record and playback to hear audio quality" },
            { name: "Check detected device", text: "Verify the correct microphone is selected" },
          ]
        )}
      />
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
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Microphone Test
            </h1>
            <p className="text-muted-foreground">
              Test your microphone with real-time audio visualization and recording.
            </p>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 flex justify-center"
          >
            {!isListening && (
              <Button
                size="lg"
                onClick={startListening}
                className="h-14 px-8 text-lg font-semibold gap-3"
              >
                <Mic className="h-5 w-5" />
                Start Microphone Test
              </Button>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col">
                <h3 className="font-semibold text-foreground mb-4">Audio Waveform</h3>
                <div className="aspect-video bg-muted rounded-xl overflow-hidden mb-4 relative">
                  {!isListening && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Mic className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm">Start to see visualization</p>
                    </div>
                  )}
                  {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <MicOff className="h-12 w-12 text-destructive mb-4" />
                      <p className="text-destructive text-sm text-center">{error}</p>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={300}
                    className={`w-full h-full ${!isListening ? "hidden" : ""}`}
                  />
                </div>

                {/* Volume Meter */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Volume Level</span>
                    <span className="text-sm font-semibold text-foreground">{volume}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${volume}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {!isListening ? (
                    <Button variant="hero" onClick={startListening}>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Microphone
                    </Button>
                  ) : (
                    <>
                      <Button variant="destructive" onClick={stopListening}>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                      {!isRecording ? (
                        <Button variant="default" onClick={startRecording}>
                          <Play className="h-4 w-4 mr-2" />
                          Record
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={stopRecording}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Playback & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col">
                <h3 className="font-semibold text-foreground mb-4">Recording Playback</h3>
                
                <div className="flex-1 flex flex-col">
                  {audioUrl ? (
                    <div className="space-y-4">
                      <audio controls src={audioUrl} className="w-full" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          URL.revokeObjectURL(audioUrl);
                          setAudioUrl("");
                        }}
                      >
                        Clear Recording
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Volume2 className="h-12 w-12 mb-4" />
                      <p className="text-sm">Record audio to play it back here</p>
                    </div>
                  )}
                </div>

                {/* Mic Info */}
                {micInfo && (
                  <div className="mt-auto pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Detected Device</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{micInfo}</p>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 p-4 rounded-xl bg-success/5 border border-success/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-success">Privacy Notice:</strong> All audio processing happens locally on your device. Recordings are not uploaded anywhere.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MicrophoneTest;
