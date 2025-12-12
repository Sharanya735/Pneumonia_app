import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                Powered by AI & FastAPI
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-glow"
            >
              Chest X-Ray Pneumonia Detection
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            >
              AI-powered analysis for identifying Viral and Bacterial Pneumonia with precision and speed.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={() => navigate(user ? '/upload' : '/auth')}
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-glow group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose PneumoScan AI?</h2>
            <p className="text-muted-foreground text-lg">Advanced AI technology for accurate medical imaging analysis</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get results in seconds with our optimized deep learning model"
              },
              {
                icon: Target,
                title: "High Accuracy",
                description: "State-of-the-art CNN architecture trained on thousands of X-rays"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your medical data is processed securely and never stored"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-medical rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
