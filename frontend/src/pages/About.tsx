import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Database, Brain, Shield, Code, Heart, Microscope, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const learningCards = [
    {
      icon: Heart,
      title: "What is Pneumonia?",
      description:
        "Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing symptoms like cough, fever, chills, and difficulty breathing.",
      color: "destructive",
    },
    {
      icon: Microscope,
      title: "Viral vs Bacterial",
      description:
        "Bacterial pneumonia is typically more severe and caused by bacteria like Streptococcus pneumoniae. Viral pneumonia is usually milder and caused by viruses like influenza or RSV. Treatment differs significantly.",
      color: "warning",
    },
    {
      icon: Stethoscope,
      title: "X-Ray Detection",
      description:
        "Chest X-rays help detect pneumonia by showing areas of opacity or infiltrates in the lungs. AI models can identify patterns invisible to the human eye, improving early detection and diagnosis accuracy.",
      color: "primary",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-4">About PneumoScan</h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Empowering radiology through deep learning
        </p>

        <div className="space-y-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 shadow-soft hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-medical rounded-xl">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We aim to democratize access to AI-powered medical imaging analysis. 
                    By leveraging cutting-edge deep learning models, we provide fast, accurate 
                    pneumonia detection to support healthcare professionals and researchers worldwide.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Dataset */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 shadow-soft hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-medical rounded-xl">
                  <Database className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">Dataset</h2>
                  <p className="text-muted-foreground mb-4">
                    Our model is trained on the comprehensive <span className="font-semibold text-foreground">Chest X-Ray Pneumonia</span> dataset 
                    by Paul Mooney, available on Kaggle. This dataset contains thousands of validated chest X-ray images 
                    labeled as Normal, Viral Pneumonia, or Bacterial Pneumonia.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-foreground">
                      <span className="text-primary">import</span> kagglehub{'\n'}
                      path = kagglehub.dataset_download(<span className="text-success">"paultimothymooney/chest-xray-pneumonia"</span>){'\n'}
                      <span className="text-primary">print</span>(<span className="text-success">"Path to dataset files:"</span>, path)
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Model */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 shadow-soft hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-medical rounded-xl">
                  <Code className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">Technology</h2>
                  <p className="text-muted-foreground mb-4">
                    Our solution uses a state-of-the-art Convolutional Neural Network (CNN) architecture, 
                    optimized for medical image classification. The model has been trained on thousands of 
                    X-ray images and achieves high accuracy in distinguishing between normal lungs and 
                    different types of pneumonia.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-semibold mb-1">Frontend</p>
                      <p className="text-sm text-muted-foreground">React + TypeScript + Framer Motion</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-semibold mb-1">Backend</p>
                      <p className="text-sm text-muted-foreground">FastAPI + TensorFlow/PyTorch</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-warning/5 border-warning/20 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-warning/20 rounded-xl">
                  <Shield className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-warning">Important Disclaimer</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This is a <span className="font-semibold text-foreground">research and educational project</span> designed 
                    to demonstrate the potential of AI in medical imaging. It is <span className="font-semibold text-foreground">NOT intended for clinical use</span> or 
                    as a substitute for professional medical advice, diagnosis, or treatment. Always consult 
                    qualified healthcare professionals for medical decisions.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Interactive Learning Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Understanding Pneumonia
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {learningCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 h-full shadow-soft hover:shadow-glow transition-all duration-300">
                    <div
                      className={`p-3 rounded-xl inline-block mb-4 ${
                        card.color === "destructive"
                          ? "bg-destructive/10"
                          : card.color === "warning"
                          ? "bg-warning/10"
                          : "bg-primary/10"
                      }`}
                    >
                      <card.icon
                        className={`h-6 w-6 ${
                          card.color === "destructive"
                            ? "text-destructive"
                            : card.color === "warning"
                            ? "text-warning"
                            : "text-primary"
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
