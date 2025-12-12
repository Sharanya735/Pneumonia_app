import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take a photo.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
          setIsOpen(false);
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Take a Photo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Capture X-Ray Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button
                onClick={() => handleOpenChange(false)}
                variant="outline"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};

export default CameraCapture;
