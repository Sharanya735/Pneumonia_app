import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, X, CheckCircle, AlertTriangle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import ConfidenceGauge from "@/components/ConfidenceGauge";
import StepProgress from "@/components/StepProgress";
import ModelInfoModal from "@/components/ModelInfoModal";
import CameraCapture from "@/components/CameraCapture";
import ConfidenceAlert from "@/components/ConfidenceAlert";
import { generatePDFReport } from "@/utils/reportGenerator";
import { useTranslation } from "react-i18next";
import { analyzeImageApi, type PredictionResult } from '@/api/scanApi';



const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPG, JPEG, PNG)",
        variant: "destructive"
      });
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setCurrentStep(1);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const analyzeImage = async () => {
  if (!selectedFile) return;

  setIsAnalyzing(true);
  setCurrentStep(2);

  try {
    // ✅ New axios-based API call
    const data = await analyzeImageApi(selectedFile);

    setResult(data);
    setCurrentStep(3);

    // ✅ Save to history (same as before)
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    history.unshift({
      ...data,
      date: new Date().toISOString(),
      thumbnail: preview,
    });
    localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 20)));

    toast({
      title: "Analysis Complete",
      description: "Your X-ray has been analyzed successfully",
    });
  } catch (error) {
    toast({
      title: "Analysis Failed",
      description: "Unable to connect to the API. Please ensure the FastAPI server is running.",
      variant: "destructive"
    });
    setCurrentStep(1);
  } finally {
    setIsAnalyzing(false);
  }
};


  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setCurrentStep(1);
  };

  const downloadReport = () => {
    if (!result || !preview) return;
    setCurrentStep(4);
    generatePDFReport({
      prediction: result.prediction,
      confidence: result.confidence,
      imageData: preview,
      date: new Date(),
    });
    toast({
      title: "Report Downloaded",
      description: "Your PDF report has been generated successfully",
    });
  };

  const getResultConfig = (prediction: string) => {
  const predLower = prediction.toLowerCase();

  if (predLower.includes('uncertain') || predLower.includes('unknown')) {
    return { icon: AlertTriangle, color: 'secondary', label: 'Uncertain / Unknown' };
  } else if (predLower.includes('normal')) {
    return { icon: CheckCircle, color: 'success', label: 'Normal' };
  } else if (predLower.includes('viral')) {
    return { icon: AlertTriangle, color: 'warning', label: 'Viral Pneumonia' };
  } else if (predLower.includes('bacterial')) {
    return { icon: XCircle, color: 'destructive', label: 'Bacterial Pneumonia' };
  } else {
    return { icon: AlertTriangle, color: 'secondary', label: 'Unknown Result' };
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">{t("upload.title")}</h1>
          <ModelInfoModal />
        </div>
        <p className="text-center text-muted-foreground mb-8">
          {t("upload.subtitle")}
        </p>
        
        <StepProgress currentStep={currentStep} />

        <Card className="p-8 shadow-soft">
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-primary bg-primary/5 shadow-glow' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center">
                    <UploadIcon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {t("upload.dropzone")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, JPEG, PNG (Max 10MB)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <label className="cursor-pointer">
                        Select File
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileInput}
                        />
                      </label>
                    </Button>
                    <CameraCapture onCapture={handleFileSelect} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="relative group">
                      <img
                        src={preview}
                        alt="X-ray preview"
                        className="w-full rounded-xl shadow-soft"
                      />
                      <button
                        onClick={reset}
                        className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <AnimatePresence>
                      {result && result.heatmap && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p className="text-sm font-medium text-center text-muted-foreground mb-2">
                            AI Focus (Heatmap)
                          </p>
                          <img
                            src={`data:image/jpeg;base64,${result.heatmap}`}
                            alt="Prediction heatmap"
                            className="w-full rounded-xl shadow-soft"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col justify-center">
                    {isAnalyzing ? (
                      <Loader />
                    ) : result ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {(() => {
                          const config = getResultConfig(result.prediction);
                          const ResultIcon = config.icon;
                          return (
                            <>
                              <ConfidenceAlert confidence={result.confidence * 100} />
                              
                              <div className="text-center">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                                  config.color === 'success' ? 'bg-success/10 text-success' :
                                  config.color === 'warning' ? 'bg-warning/10 text-warning' :
                                  'bg-destructive/10 text-destructive'
                                }`}>
                                  <ResultIcon className="h-5 w-5" />
                                  <span className="font-semibold">{config.label}</span>
                                </div>
                              </div>

                              <ConfidenceGauge 
                                confidence={result.confidence * 100} 
                                variant={config.color as any}
                              />

                              <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                  The model detected <span className="font-semibold text-foreground">{config.label}</span>
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Button 
                                  onClick={downloadReport}
                                  className="w-full"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  {t("results.downloadReport")}
                                </Button>
                                <Button 
                                  onClick={reset}
                                  variant="outline"
                                  className="w-full"
                                >
                                  {t("upload.uploadAnother")}
                                </Button>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    ) : (
                      <div className="text-center space-y-4">
                        <p className="text-muted-foreground">Ready to analyze</p>
                        <div className="space-y-2">
                          <Button 
                            onClick={analyzeImage}
                            className="w-full bg-primary hover:bg-primary/90 shadow-glow"
                            size="lg"
                          >
                            {t("upload.analyze")}
                          </Button>
                          <Button 
                            onClick={reset}
                            variant="outline"
                            className="w-full"
                          >
                            {t("upload.cancel")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default Upload;
