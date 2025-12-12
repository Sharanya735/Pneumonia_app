import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Analyze" },
  { number: 3, label: "Result" },
  { number: 4, label: "Report" },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep > step.number
                    ? "bg-success text-success-foreground"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground shadow-glow animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </motion.div>
              <p
                className={`text-xs mt-2 font-medium transition-colors ${
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-6">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-success origin-left"
                />
                <div className="h-full bg-muted" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
