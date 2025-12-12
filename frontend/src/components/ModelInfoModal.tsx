import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const ModelInfoModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Info className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Model Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-medical rounded-lg text-primary-foreground"
          >
            <h3 className="font-bold text-lg mb-2">ResNet-50 Architecture</h3>
            <p className="text-sm opacity-90">
              Deep Residual Network with 50 layers, optimized for medical image
              classification
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Model Type</p>
              <p className="font-semibold">Convolutional Neural Network</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Dataset</p>
              <p className="font-semibold">Kaggle Chest X-Ray Pneumonia</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Training Accuracy
              </p>
              <p className="font-semibold text-success">94.2%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Validation Accuracy
              </p>
              <p className="font-semibold text-success">91.8%</p>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Training Progress</h4>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Epochs Completed</span>
                  <span className="font-medium">50/50</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Training time: ~6 hours on NVIDIA Tesla T4 GPU
              </div>
            </div>
          </div>

          <div className="p-4 border-l-4 border-warning bg-warning/5">
            <p className="text-sm">
              <span className="font-semibold">Note:</span> This model is for
              research and educational purposes. Always consult healthcare
              professionals for medical decisions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelInfoModal;
