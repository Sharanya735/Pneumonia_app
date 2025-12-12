import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfidenceGaugeProps {
  confidence: number;
  variant: "success" | "warning" | "destructive";
}

const ConfidenceGauge = ({ confidence, variant }: ConfidenceGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(confidence);
    }, 300);
    return () => clearTimeout(timer);
  }, [confidence]);
  
  const colorMap = {
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive"
  };
  
  const bgColorMap = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive"
  };
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 56}
          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 56 * (1 - displayValue / 100)
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={colorMap[variant]}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={`text-3xl font-bold ${colorMap[variant]}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {Math.round(displayValue)}%
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1">Confidence</span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
