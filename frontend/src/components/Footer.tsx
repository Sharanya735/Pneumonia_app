import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-auto py-6 bg-gradient-medical border-t border-border"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-primary-foreground">
          © 2025 PneumoScan. Powered by AI & FastAPI.
        </p>
        <p className="text-xs text-primary-foreground/80 mt-1">
          For research and educational purposes only. Not for clinical use.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
