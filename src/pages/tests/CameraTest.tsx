import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, FlipHorizontal, Download, VideoOff, RefreshCw } from "lucide-react";

const CameraTest = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isMirrored, setIsMirrored] = useState(true);
  const [snapshot, setSnapshot] = useState<string>("");
  const [cameraInfo, setCameraInfo] = useState<{
    label: string;
    width: number;
    height: number;
  } | null>(null);

  const startCamera = async () => {
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get camera info
      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      setCameraInfo({
        label: videoTrack.label || "Unknown Camera",
        width: settings.width || 0,
        height: settings.height || 0,
      });
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions and try again.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraInfo(null);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        setSnapshot(canvas.toDataURL("image/png"));
      }
    }
  };

  const downloadSnapshot = () => {
    if (snapshot) {
      const link = document.createElement("a");
      link.download = `camera-test-${Date.now()}.png`;
      link.href = snapshot;
      link.click();
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
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Camera Test
            </h1>
            <p className="text-muted-foreground">
              Test your webcam with live preview. All processing happens locally.
            </p>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 flex justify-center"
          >
            {!stream && (
              <Button
                size="lg"
                onClick={startCamera}
                className="h-14 px-8 text-lg font-semibold gap-3"
              >
                <Camera className="h-5 w-5" />
                Start Camera Test
              </Button>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden mb-4 relative">
                  {!stream && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <VideoOff className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm">Camera not started</p>
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
                    className={`w-full h-full object-cover ${isMirrored ? "scale-x-[-1]" : ""} ${!stream ? "hidden" : ""}`}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {!stream ? (
                    <Button variant="hero" onClick={startCamera}>
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <>
                      <Button variant="destructive" onClick={stopCamera}>
                        <VideoOff className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                      <Button variant="outline" onClick={() => setIsMirrored(!isMirrored)}>
                        <FlipHorizontal className="h-4 w-4 mr-2" />
                        {isMirrored ? "Unmirror" : "Mirror"}
                      </Button>
                      <Button variant="default" onClick={takeSnapshot}>
                        <Camera className="h-4 w-4 mr-2" />
                        Snapshot
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Camera Info */}
              {cameraInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-card border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-2">Camera Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Device</p>
                      <p className="font-medium text-foreground truncate">{cameraInfo.label}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Resolution</p>
                      <p className="font-medium text-foreground">{cameraInfo.width} × {cameraInfo.height}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Snapshot Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Snapshot Preview</h3>
                <div className="aspect-video bg-muted rounded-xl overflow-hidden mb-4 relative">
                  {snapshot ? (
                    <img src={snapshot} alt="Snapshot" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm">Take a snapshot to preview</p>
                    </div>
                  )}
                </div>
                {snapshot && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadSnapshot}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" onClick={() => setSnapshot("")}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 rounded-xl bg-success/5 border border-success/20"
              >
                <p className="text-sm text-muted-foreground">
                  <strong className="text-success">Privacy Notice:</strong> Your camera feed and snapshots are processed entirely on your device. No data is uploaded to any server.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CameraTest;
