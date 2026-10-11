import jsPDF from "jspdf";
import { Farm, YieldPredictionResult, DiseaseResult, SoilData, WeatherData } from "../types";

export function generateFarmPDFReport(
  farm: Farm,
  prediction?: YieldPredictionResult | null,
  disease?: DiseaseResult | null,
  soil?: SoilData | null,
  weather?: WeatherData | null
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AgriVision AI - Farm Intelligence Report", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 150, 18);

  let y = 38;

  // Farm Basic Details
  doc.setTextColor(31, 41, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("1. Farm Overview", 14, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Farmer Name: ${farm.farmerName}`, 14, y);
  doc.text(`Farm Identifier: ${farm.farmName}`, 110, y);

  y += 5;
  doc.text(`Crop & Variety: ${farm.crop}`, 14, y);
  doc.text(`Location: ${farm.village}, ${farm.district}, ${farm.state}`, 110, y);

  y += 5;
  doc.text(`Farm Size: ${farm.areaAcres} Acres`, 14, y);
  doc.text(`Soil & Irrigation: ${farm.soilType} | ${farm.irrigationType}`, 110, y);

  y += 5;
  doc.text(`Health Index: ${farm.healthScore}/100`, 14, y);
  doc.text(`Disease Risk Level: ${farm.diseaseRisk}`, 110, y);

  y += 10;
  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.line(14, y, 196, y);

  // Yield Prediction Section
  if (prediction) {
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text("2. AI Crop Yield Prediction", 14, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(`Predicted Yield per Acre: ${prediction.predictedYieldPerAcre} Quintals`, 14, y);
    doc.text(`Total Expected Farm Yield: ${prediction.totalPredictedYield} Quintals`, 110, y);

    y += 5;
    doc.text(`Model Confidence Score: ${prediction.confidenceScore}%`, 14, y);
    doc.text(`Water Requirement: ${prediction.waterRequirement}`, 110, y);

    y += 6;
    doc.setFont("helvetica", "italic");
    doc.text(`AI Scientific Insight: ${prediction.aiExplanation.substring(0, 110)}...`, 14, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Fertilizer Advice: ${prediction.fertilizerRecommendation}`, 14, y);

    y += 10;
    doc.line(14, y, 196, y);
  }

  // Disease Scanner Section
  if (disease) {
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text("3. Leaf Disease Diagnosis", 14, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(`Detected Condition: ${disease.name}`, 14, y);
    doc.text(`Severity Level: ${disease.severity}%`, 110, y);

    y += 5;
    doc.text(`Symptoms: ${disease.symptoms.substring(0, 100)}...`, 14, y);

    y += 6;
    doc.text(`Organic Remedy: ${disease.organicRemedies}`, 14, y);

    y += 5;
    doc.text(`Chemical Remedy: ${disease.chemicalRemedies}`, 14, y);

    y += 10;
    doc.line(14, y, 196, y);
  }

  // Soil Health
  if (soil) {
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text("4. Soil NPK Health Profile", 14, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(`Soil pH: ${soil.ph} | Nitrogen: ${soil.nitrogen} kg/ha | Phosphorus: ${soil.phosphorus} kg/ha`, 14, y);

    y += 5;
    doc.text(`Potassium: ${soil.potassium} kg/ha | Organic Carbon: ${soil.organicCarbon}% | Moisture: ${soil.moisture}%`, 14, y);

    y += 8;
    doc.line(14, y, 196, y);
  }

  // Footer note & QR mock
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("🌱 AgriVision AI - Verified Farm Intelligence Document. Smart India Hackathon Winner Solution.", 14, 285);

  doc.save(`${farm.farmName.replace(/\s+/g, "_")}_AgriVision_Report.pdf`);
}
