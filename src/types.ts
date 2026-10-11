export type UserRole = "farmer" | "officer" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  avatar?: string;
  state: string;
  district: string;
}

export interface RiskPredictionResult {
  cropHealth: "Healthy" | "Moderate stress" | "High stress";
  expectedYieldRangeMin: number; // Quintals / acre
  expectedYieldRangeMax: number;
  yieldUnit: string;
  diseaseRisk: "Low" | "Moderate" | "High";
  weatherRisk: "Low" | "Moderate" | "High";
  cropStress: "Low" | "Moderate" | "High";
  isPrototypeEstimate: boolean;
  modelConfidence: number;
  explanation: string;
}

export interface ActionableRecommendation {
  whatToDo: string;
  why: string;
  when: string;
  urgency: "High" | "Medium" | "Normal";
  audioText: string;
  category: "Inspection" | "Irrigation" | "Pest Control" | "Soil Nutrient" | "Harvest";
}

export interface WorkflowState {
  languageCode: string;
  voiceTranscript: string;
  cropType: string;
  sowingDate: string;
  soilType: string;
  irrigationMethod: string;
  symptomsNotes: string;
  lat: number;
  lng: number;
  isGpsActive: boolean;
  gpsPoints: [number, number][];
  fieldPolygonConfirmed: boolean;
  fieldAreaAcres: number;
  isWalkingSimulation: boolean;
  predictionResult?: RiskPredictionResult;
  recommendation?: ActionableRecommendation;
}

export interface Farm {
  id: string;
  farmerName: string;
  farmName: string;
  crop: string;
  state: string;
  district: string;
  village: string;
  areaAcres: number;
  soilType: string;
  irrigationType: string;
  lat: number;
  lng: number;
  boundaryPoints?: [number, number][];
  healthScore: number;
  expectedYield: number; // Quintals/acre
  diseaseRisk: "Low" | "Medium" | "High" | "Moderate";
  lastScanned: string;
  imageUrl?: string;
}

export interface YieldPredictionInput {
  crop: string;
  area: number;
  soilType: string;
  rainfall: number; // mm
  temperature: number; // Celsius
  humidity: number; // %
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  previousYield: number;
  fertilizerUsed: string;
  irrigationType: string;
}

export interface YieldPredictionResult {
  predictedYieldPerAcre: number;
  totalPredictedYield: number;
  unit: string;
  confidenceScore: number;
  riskLevel: "Low" | "Medium" | "High";
  aiExplanation: string;
  fertilizerRecommendation: string;
  bestHarvestTime: string;
  waterRequirement: string;
  benchmarkComparison: {
    regionalAverage: number;
    topPerformer: number;
  };
}

export interface DiseaseResult {
  name: string;
  severity: number; // percentage
  symptoms: string;
  causes: string;
  organicRemedies: string;
  chemicalRemedies: string;
  preventiveMeasures: string;
  sampleImage?: string;
}

export interface SatelliteMetadata {
  date: string;
  ndviScore: number;
  moistureIndex: number;
  vegetationDensity: number;
  surfaceTemp: number; // C
  cloudCover: number; // %
}

export interface SoilData {
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  organicCarbon: number; // %
  moisture: number; // %
  soilTexture: string;
  fertilityScore: number;
  recommendations: string[];
}

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    rainfallMm: number;
    windSpeedKm: number;
    pressureHpa: number;
    uvIndex: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    day: string;
    tempHigh: number;
    tempLow: number;
    rainProb: number;
    condition: string;
  }>;
  aiAdvice: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  category: string;
  benefits: string;
  eligibility: string;
  subsidyPercentage: string;
  deadline: string;
  officialLink: string;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  mandiName: string;
  state: string;
  currentPrice: number; // Rs per Quintal
  previousPrice: number;
  trend: "up" | "down" | "stable";
  bestSellingWindow: string;
  aiForecast: string;
  historical: Array<{ month: string; price: number }>;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  language?: string;
  audioUrl?: string;
}

export interface IoTSensorData {
  soilMoisture: number; // %
  soilPh: number;
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  ambientTemp: number;
  batteryLevel: number;
}
