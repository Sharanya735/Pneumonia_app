import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        upload: "Upload",
        about: "About",
        history: "History",
        dashboard: "Dashboard",
      },
      upload: {
        title: "Upload X-Ray Image",
        subtitle: "Upload a chest X-ray for AI-powered pneumonia detection",
        dropzone: "Drop your X-ray image here, or click to browse",
        analyze: "Analyze Image",
        cancel: "Cancel",
        uploadAnother: "Upload Another Image",
        takePhoto: "Take a Photo",
      },
      results: {
        normal: "Normal",
        viral: "Viral Pneumonia",
        bacterial: "Bacterial Pneumonia",
        lowConfidence: "Low confidence — please upload a clearer X-ray.",
        highConfidence: "High confidence prediction!",
        downloadReport: "Download Report",
      },
      about: {
        title: "About PneumoScan",
        mission: "Our Mission",
        dataset: "Dataset",
        technology: "Technology",
        disclaimer: "Important Disclaimer",
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        upload: "Subir",
        about: "Acerca de",
        history: "Historial",
        dashboard: "Panel",
      },
      upload: {
        title: "Subir Imagen de Rayos X",
        subtitle: "Suba una radiografía de tórax para detección de neumonía con IA",
        dropzone: "Suelte su imagen de rayos X aquí o haga clic para explorar",
        analyze: "Analizar Imagen",
        cancel: "Cancelar",
        uploadAnother: "Subir Otra Imagen",
        takePhoto: "Tomar una Foto",
      },
      results: {
        normal: "Normal",
        viral: "Neumonía Viral",
        bacterial: "Neumonía Bacteriana",
        lowConfidence: "Confianza baja — por favor suba una radiografía más clara.",
        highConfidence: "¡Predicción de alta confianza!",
        downloadReport: "Descargar Informe",
      },
      about: {
        title: "Acerca de PneumoScan",
        mission: "Nuestra Misión",
        dataset: "Conjunto de Datos",
        technology: "Tecnología",
        disclaimer: "Aviso Importante",
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        upload: "अपलोड",
        about: "हमारे बारे में",
        history: "इतिहास",
        dashboard: "डैशबोर्ड",
      },
      upload: {
        title: "एक्स-रे छवि अपलोड करें",
        subtitle: "एआई-संचालित निमोनिया का पता लगाने के लिए छाती का एक्स-रे अपलोड करें",
        dropzone: "अपनी एक्स-रे छवि यहाँ छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
        analyze: "छवि का विश्लेषण करें",
        cancel: "रद्द करें",
        uploadAnother: "एक और छवि अपलोड करें",
        takePhoto: "फ़ोटो लें",
      },
      results: {
        normal: "सामान्य",
        viral: "वायरल निमोनिया",
        bacterial: "बैक्टीरियल निमोनिया",
        lowConfidence: "कम विश्वास — कृपया स्पष्ट एक्स-रे अपलोड करें।",
        highConfidence: "उच्च विश्वास भविष्यवाणी!",
        downloadReport: "रिपोर्ट डाउनलोड करें",
      },
      about: {
        title: "PneumoScan के बारे में",
        mission: "हमारा मिशन",
        dataset: "डेटासेट",
        technology: "तकनीक",
        disclaimer: "महत्वपूर्ण अस्वीकरण",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
