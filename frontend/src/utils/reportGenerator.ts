import jsPDF from "jspdf";

interface ReportData {
  prediction: string;
  confidence: number;
  imageData: string;
  date: Date;
}

export const generatePDFReport = (data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(66, 133, 244);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("PneumoScan Report", pageWidth / 2, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("AI-Powered Pneumonia Detection", pageWidth / 2, 30, {
    align: "center",
  });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${data.date.toLocaleString()}`, 20, 55);

  // Results section
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Analysis Results", 20, 70);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Prediction: ${data.prediction}`, 20, 85);
  doc.text(
    `Confidence: ${(data.confidence * 100).toFixed(2)}%`,
    20,
    95
  );

  // Add image
  try {
    const imgWidth = 100;
    const imgHeight = 100;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(data.imageData, "JPEG", imgX, 110, imgWidth, imgHeight);
  } catch (error) {
    console.error("Error adding image to PDF:", error);
  }

  // Disclaimer
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const disclaimer =
    "DISCLAIMER: This report is for educational and research purposes only. It is NOT intended for clinical use or as a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, 225);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("PneumoScan - AI Medical Imaging Analysis", pageWidth / 2, 280, {
    align: "center",
  });

  // Save
  doc.save(`pneumoscan-report-${Date.now()}.pdf`);
};
