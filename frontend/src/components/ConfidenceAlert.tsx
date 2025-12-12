import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfidenceAlertProps {
  confidence: number;
}

const ConfidenceAlert = ({ confidence }: ConfidenceAlertProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, [confidence]);

  const isLow = confidence < 60;
  const isHigh = confidence > 90;

  if (!isLow && !isHigh) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
            isLow
              ? "bg-warning/5 border-warning/20"
              : "bg-success/5 border-success/20"
          }`}
        >
          {isLow ? (
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`font-semibold ${isLow ? "text-warning" : "text-success"}`}>
              {isLow ? "Low Confidence" : "High Confidence"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isLow
                ? "Please upload a clearer X-ray for more accurate results."
                : "The model is highly confident in this prediction!"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfidenceAlert;
