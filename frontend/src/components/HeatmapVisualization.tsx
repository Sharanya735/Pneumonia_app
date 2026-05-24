import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Layers, ScanLine, Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface HeatmapVisualizationProps {
  originalImage: string;         // base64 data URL (from FileReader)
  heatmapImage: string | null;   // base64 string (raw, from API response) — null if generation failed
  prediction: string;
}

type ViewMode = "original" | "heatmap" | "blend";

const VIEW_TABS: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }>; needsHeatmap: boolean }[] = [
  { id: "original", label: "Original",  icon: Eye,     needsHeatmap: false },
  { id: "heatmap", label: "AI Focus",  icon: ScanLine, needsHeatmap: true  },
  { id: "blend",   label: "Overlay",   icon: Layers,   needsHeatmap: true  },
];

const LEGEND_LABELS = [
  { label: "Low", color: "#00008b" },
  { label: "", color: "#0000ff" },
  { label: "", color: "#00ffff" },
  { label: "", color: "#00ff00" },
  { label: "", color: "#ffff00" },
  { label: "", color: "#ff8000" },
  { label: "High", color: "#ff0000" },
];

const HeatmapVisualization = ({ originalImage, heatmapImage, prediction }: HeatmapVisualizationProps) => {
  const hasHeatmap = !!heatmapImage;
  const [viewMode, setViewMode] = useState<ViewMode>(hasHeatmap ? "blend" : "original");
  const [blendOpacity, setBlendOpacity] = useState(55);
  const [zoom, setZoom] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const heatmapSrc = heatmapImage ? `data:image/jpeg;base64,${heatmapImage}` : "";

  const handleZoomIn  = useCallback(() => setZoom(z => Math.min(z + 0.25, 2.5)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 0.25, 0.5)), []);
  const handleReset   = useCallback(() => { setZoom(1); setBlendOpacity(55); }, []);

  const predLower = prediction.toLowerCase();
  const accentColor =
    predLower.includes("normal") ? "text-success" :
    predLower.includes("bacterial") ? "text-destructive" :
    predLower.includes("viral") ? "text-warning" :
    "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-6 rounded-2xl border border-border bg-card shadow-soft overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Grad-CAM Heatmap</span>
          <Badge variant="secondary" className={`text-xs ${accentColor}`}>
            {prediction}
          </Badge>
        </div>

        {/* Info tooltip trigger */}
        <div className="relative">
          <button
            id="heatmap-info-btn"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                className="absolute right-0 top-8 z-50 w-64 p-3 rounded-xl bg-popover border border-border shadow-lg text-xs text-muted-foreground leading-relaxed"
              >
                <p className="font-semibold text-foreground mb-1">What is Grad-CAM?</p>
                <p>
                  <span className="text-red-500 font-medium">Red/warm</span> areas are where the AI focused
                  most when making its prediction. 
                  <span className="text-blue-400 font-medium"> Blue/cool</span> areas contributed less.
                  This helps you see which lung regions triggered the model's decision.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── View-mode tabs ── */}
      <div className="flex gap-1 px-4 pt-3">
        {VIEW_TABS.map(({ id, label, icon: Icon, needsHeatmap }) => {
          const disabled = needsHeatmap && !hasHeatmap;
          return (
            <button
              key={id}
              id={`heatmap-tab-${id}`}
              onClick={() => !disabled && setViewMode(id)}
              title={disabled ? "Heatmap not available" : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                disabled
                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                  : viewMode === id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── No-heatmap notice ── */}
      <AnimatePresence>
        {!hasHeatmap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-3 rounded-xl bg-muted/40 border border-border px-4 py-3 flex items-start gap-2"
          >
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-snug">
              <span className="font-semibold text-foreground">Heatmap unavailable.</span>{" "}
              The AI still used Grad-CAM internally, but the overlay could not be generated for this image.
              Try re-uploading a clearer chest X-ray.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image viewer ── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-black/5 mx-4 mt-3 rounded-xl"
        style={{ minHeight: 300 }}
      >
        <AnimatePresence mode="wait">
          {viewMode === "original" && (
            <motion.div
              key="original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center p-2"
            >
              <img
                src={originalImage}
                alt="Original X-ray"
                style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease" }}
                className="max-h-80 w-auto rounded-lg object-contain"
              />
            </motion.div>
          )}

          {viewMode === "heatmap" && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center p-2"
            >
              <img
                src={heatmapSrc}
                alt="Grad-CAM heatmap"
                style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease" }}
                className="max-h-80 w-auto rounded-lg object-contain"
              />
            </motion.div>
          )}

          {viewMode === "blend" && (
            <motion.div
              key="blend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center p-2"
            >
              {/* Stacked blend using CSS mix */}
              <div
                className="relative max-h-80 rounded-lg overflow-hidden"
                style={{ transform: `scale(${zoom})`, transition: "transform 0.3s ease", display: "inline-block" }}
              >
                <img
                  src={originalImage}
                  alt="X-ray base"
                  className="block max-h-80 w-auto object-contain"
                />
                <img
                  src={heatmapSrc}
                  alt="Heatmap overlay"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  style={{ opacity: blendOpacity / 100, mixBlendMode: "multiply" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            id="heatmap-zoom-in"
            onClick={handleZoomIn}
            className="p-1.5 bg-background/80 backdrop-blur border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            id="heatmap-zoom-out"
            onClick={handleZoomOut}
            className="p-1.5 bg-background/80 backdrop-blur border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            id="heatmap-zoom-reset"
            onClick={handleReset}
            className="p-1.5 bg-background/80 backdrop-blur border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Zoom level badge */}
        {zoom !== 1 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-background/80 backdrop-blur border border-border rounded-md text-xs font-mono">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>

      {/* ── Blend slider (only in overlay mode) ── */}
      <AnimatePresence>
        {viewMode === "blend" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pt-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 shrink-0">Heatmap opacity</span>
              <div className="flex-1">
                <Slider
                  id="heatmap-opacity-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={[blendOpacity]}
                  onValueChange={([v]) => setBlendOpacity(v)}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{blendOpacity}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Color legend ── */}
      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground mb-2 font-medium">AI Attention Scale</p>
        <div className="flex items-center gap-0 rounded-lg overflow-hidden h-4 w-full"
          style={{
            background: "linear-gradient(to right, #00008b, #0000ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000)"
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-blue-500 font-medium">Low</span>
          <span className="text-xs text-muted-foreground">Attention</span>
          <span className="text-xs text-red-500 font-medium">High</span>
        </div>
      </div>

      {/* ── Region interpretation ── */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-muted/40 border border-border p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">How to read this map</p>
          <div className="grid grid-cols-1 gap-1.5">
            {[
              { dot: "bg-red-500", text: "Red / hot: Regions most critical to the AI's decision" },
              { dot: "bg-yellow-400", text: "Yellow / warm: Moderately influential regions" },
              { dot: "bg-blue-500", text: "Blue / cool: Background regions the AI largely ignored" },
            ].map(({ dot, text }) => (
              <div key={text} className="flex items-start gap-2">
                <div className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${dot}`} />
                <p className="text-xs text-muted-foreground leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeatmapVisualization;
