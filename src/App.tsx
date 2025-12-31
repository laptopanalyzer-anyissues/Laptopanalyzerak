import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DisplayTest from "./pages/tests/DisplayTest";
import KeyboardTest from "./pages/tests/KeyboardTest";
import CameraTest from "./pages/tests/CameraTest";
import MicrophoneTest from "./pages/tests/MicrophoneTest";
import AudioTest from "./pages/tests/AudioTest";
import NetworkTest from "./pages/tests/NetworkTest";
import TouchpadTest from "./pages/tests/TouchpadTest";
import PortsTest from "./pages/tests/PortsTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test/display" element={<DisplayTest />} />
            <Route path="/test/keyboard" element={<KeyboardTest />} />
            <Route path="/test/camera" element={<CameraTest />} />
            <Route path="/test/microphone" element={<MicrophoneTest />} />
            <Route path="/test/audio" element={<AudioTest />} />
            <Route path="/test/network" element={<NetworkTest />} />
            <Route path="/test/touchpad" element={<TouchpadTest />} />
            <Route path="/test/ports" element={<PortsTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
