import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, VideoOff, CheckCircle2 } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const CameraTestEmbed = ({ onComplete }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);

  const startCamera = async () => {
    try {
      setError("");
      setHasStarted(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
          <Camera className="h-4 w-4" />
          <span className="font-medium">Camera Test</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Check if your webcam displays correctly
        </p>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-video bg-muted rounded-xl overflow-hidden">
          {!hasStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <Button onClick={startCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}
          {hasStarted && !stream && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <VideoOff className="h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${!stream ? "hidden" : ""}`}
          />
        </div>
      </div>

      {/* Complete Button */}
      <div className="mt-6 text-center">
        <Button onClick={onComplete} disabled={!hasStarted}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {hasStarted ? "Complete Test" : "Start camera first"}
        </Button>
      </div>
    </div>
  );
};

export default CameraTestEmbed;
