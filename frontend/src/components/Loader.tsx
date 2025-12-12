import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="p-4 bg-gradient-medical rounded-full"
      >
        <Activity className="h-8 w-8 text-primary-foreground" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-muted-foreground font-medium"
      >
        Analyzing X-Ray...
      </motion.p>
    </div>
  );
};

export default Loader;
