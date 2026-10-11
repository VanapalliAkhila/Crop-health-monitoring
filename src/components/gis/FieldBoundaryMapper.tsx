import React, { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Compass,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MapPin,
  ShieldAlert,
  Volume2,
  VolumeX,
  HelpCircle,
  Maximize2,
  Save,
  Navigation,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  calculateGeodesicArea,
  calculateHaversineDistance,
  calculatePerimeter,
  SavedFieldRecord,
} from "../../services/fieldBoundaryService";

export interface FieldBoundaryMapperProps {
  initialLat?: number;
  initialLng?: number;
  onBoundaryConfirmed: (
    points: [number, number][],
    areaAcres: number,
    fieldRecord?: SavedFieldRecord
  ) => void;
  onContinueToCropAnalysis?: () => void;
}

type MeasurementState = "idle" | "measuring" | "paused" | "finished" | "saved";
type GpsStatus = "requesting" | "active" | "weak" | "denied" | "unavailable";

export const FieldBoundaryMapper: React.FC<FieldBoundaryMapperProps> = ({
  initialLat,
  initialLng,
  onBoundaryConfirmed,
  onContinueToCropAnalysis,
}) => {
  // Primary States
  const [measurementState, setMeasurementState] = useState<MeasurementState>("idle");
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("requesting");
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);

  // Geographic Data States
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([]);
  const [walkedPath, setWalkedPath] = useState<[number, number][]>([]);
  const [walkedDistanceMeters, setWalkedDistanceMeters] = useState<number>(0);
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);

  // Proximity & Completion State
  const [isNearStart, setIsNearStart] = useState<boolean>(false);
  const [savedRecord, setSavedRecord] = useState<SavedFieldRecord | null>(null);

  // UI Modals & Settings
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Refs for Leaflet Map & Geolocation Watcher
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Leaflet Layer Refs
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const pathLineRef = useRef<L.Polyline | null>(null);
  const boundaryPolylineRef = useRef<L.Polyline | null>(null);
  const fieldPolygonRef = useRef<L.Polygon | null>(null);

  // Optional Farmer Voice Guidance
  const speakText = useCallback(
    (text: string) => {
      if (!audioEnabled || !("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synthesis error:", err);
      }
    },
    [audioEnabled]
  );

  // Stop Geolocation Tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Initialize Default or Initial Position
  useEffect(() => {
    const defaultLat = initialLat || 16.243;
    const defaultLng = initialLng || 80.648;
    if (!currentPosition) {
      setCurrentPosition([defaultLat, defaultLng]);
      setCurrentAccuracy(12);
    }
  }, [initialLat, initialLng, currentPosition]);

  // Clean up watcher on unmount
  useEffect(() => {
    return () => {
      stopTracking();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopTracking]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter: [number, number] = currentPosition || [
      initialLat || 16.243,
      initialLng || 80.648,
    ];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 18,
      zoomControl: false,
    });

    // High-resolution Satellite Imagery
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 20,
        attribution: "Esri World Imagery",
      }
    ).addTo(map);

    // Labels Overlay
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 20 }
    ).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [initialLat, initialLng]);

  // Update Leaflet Map Layers & Render Walked Path/Polygon
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Current Position Blue Marker & Accuracy Circle
    if (currentPosition) {
      const [lat, lng] = currentPosition;

      // Custom Glowing Blue Pulse Marker Icon for Farmer
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
            <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([lat, lng]);
      }

      // Accuracy Circle
      if (currentAccuracy) {
        if (!accuracyCircleRef.current) {
          accuracyCircleRef.current = L.circle([lat, lng], {
            radius: currentAccuracy,
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.12,
            weight: 1,
          }).addTo(map);
        } else {
          accuracyCircleRef.current.setLatLng([lat, lng]);
          accuracyCircleRef.current.setRadius(currentAccuracy);
        }
      }

      // Keep map centered on farmer during active walking
      if (measurementState === "measuring") {
        map.panTo([lat, lng], { animate: true });
      }
    }

    // 2. Starting Point Marker
    if (boundaryPoints.length > 0) {
      const startPos = boundaryPoints[0];
      const startIcon = L.divIcon({
        className: "custom-start-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs">
              START
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      if (!startMarkerRef.current) {
        startMarkerRef.current = L.marker(startPos, { icon: startIcon }).addTo(map);
      } else {
        startMarkerRef.current.setLatLng(startPos);
      }
    } else if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }

    // 3. Continuous Walked Path Polyline (Amber)
    if (walkedPath.length > 1) {
      if (!pathLineRef.current) {
        pathLineRef.current = L.polyline(walkedPath, {
          color: "#f59e0b",
          weight: 4,
          dashArray: "6, 6",
          opacity: 0.85,
        }).addTo(map);
      } else {
        pathLineRef.current.setLatLngs(walkedPath);
      }
    } else if (pathLineRef.current) {
      map.removeLayer(pathLineRef.current);
      pathLineRef.current = null;
    }

    // 4. Boundary Vertices Line (Emerald)
    if (boundaryPoints.length > 1 && measurementState !== "finished" && measurementState !== "saved") {
      if (!boundaryPolylineRef.current) {
        boundaryPolylineRef.current = L.polyline(boundaryPoints, {
          color: "#10b981",
          weight: 4,
          opacity: 0.9,
        }).addTo(map);
      } else {
        boundaryPolylineRef.current.setLatLngs(boundaryPoints);
      }
    } else if (boundaryPolylineRef.current) {
      map.removeLayer(boundaryPolylineRef.current);
      boundaryPolylineRef.current = null;
    }

    // 5. Closed Polygon when Finished or Saved
    if ((measurementState === "finished" || measurementState === "saved") && boundaryPoints.length >= 3) {
      if (!fieldPolygonRef.current) {
        fieldPolygonRef.current = L.polygon(boundaryPoints, {
          color: "#059669",
          fillColor: "#10b981",
          fillOpacity: 0.45,
          weight: 4,
        }).addTo(map);
      } else {
        fieldPolygonRef.current.setLatLngs(boundaryPoints);
      }

      // Auto-fit map to polygon bounds
      const bounds = L.latLngBounds(boundaryPoints);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (fieldPolygonRef.current) {
      map.removeLayer(fieldPolygonRef.current);
      fieldPolygonRef.current = null;
    }
  }, [currentPosition, currentAccuracy, boundaryPoints, walkedPath, measurementState]);

  // Handle Incoming GPS Position
  const handleGpsPosition = useCallback(
    (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const newPos: [number, number] = [latitude, longitude];

      setCurrentPosition(newPos);
      setCurrentAccuracy(Math.round(accuracy));
      setAccuracyHistory((prev) => [...prev, Math.round(accuracy)]);
      setGpsStatus(accuracy > 25 ? "weak" : "active");
      setGpsErrorMsg(null);

      // Only record points if actively measuring
      if (measurementState !== "measuring") return;

      // Filter out low-quality GPS points (>25 meters accuracy)
      if (accuracy > 25) {
        setGpsErrorMsg("GPS signal is weak. Move to an open area away from trees or buildings.");
        return;
      }

      // Update continuous walked path
      setWalkedPath((prevPath) => {
        const nextPath = [...prevPath, newPos];
        if (nextPath.length > 1) {
          const dist = calculatePerimeter(nextPath, false);
          setWalkedDistanceMeters(dist);
        }
        return nextPath;
      });

      // Add to boundary points if moved a meaningful distance (> 2.5 meters)
      setBoundaryPoints((prevPts) => {
        if (prevPts.length === 0) {
          speakText("Measurement started. Walk around the edge of your field.");
          return [newPos];
        }

        const lastPt = prevPts[prevPts.length - 1];
        const distFromLast = calculateHaversineDistance(
          lastPt[0],
          lastPt[1],
          latitude,
          longitude
        );

        // Meaningful distance filter
        if (distFromLast >= 2.5) {
          const newPts: [number, number][] = [...prevPts, newPos];

          // Check if farmer is near starting point (< 10 meters) with >= 3 points
          if (newPts.length >= 3) {
            const startPt = newPts[0];
            const distFromStart = calculateHaversineDistance(
              latitude,
              longitude,
              startPt[0],
              startPt[1]
            );

            if (distFromStart <= 10.0) {
              if (!isNearStart) {
                setIsNearStart(true);
                speakText("You are near the starting point. Tap Finish Field to close the field.");
              }
            } else {
              setIsNearStart(false);
            }
          }

          return newPts;
        }

        return prevPts;
      });
    },
    [measurementState, isNearStart, speakText]
  );

  // Start Real-Time Geolocation Tracking
  const startGpsWatcher = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGpsStatus("unavailable");
      setGpsErrorMsg("Location service is not supported by your browser.");
      return;
    }

    setGpsStatus("requesting");

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        handleGpsPosition(pos);
      },
      (err) => {
        const errMsg = err?.message || (err?.code ? `Code ${err.code}` : "Position unavailable");
        console.warn("Geolocation watch warning:", errMsg);

        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus("denied");
          setGpsErrorMsg("Location permission was denied. Please allow location access in your browser to measure your field.");
        } else {
          setGpsStatus("weak");
          setGpsErrorMsg("GPS signal is weak in preview mode. Using default farm location coordinates.");
        }

        // Default fallback position for testing/previews
        const fallbackLat = initialLat || 16.243;
        const fallbackLng = initialLng || 80.648;
        if (!currentPosition) {
          setCurrentPosition([fallbackLat, fallbackLng]);
          setCurrentAccuracy(10);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 15000,
      }
    );

    watchIdRef.current = watchId;
  }, [handleGpsPosition, initialLat, initialLng, currentPosition]);

  // Action Handlers
  const handleStartMeasurement = () => {
    setBoundaryPoints([]);
    setWalkedPath([]);
    setWalkedDistanceMeters(0);
    setIsNearStart(false);
    setSavedRecord(null);
    setMeasurementState("measuring");
    startGpsWatcher();
  };

  const handlePause = () => {
    setMeasurementState("paused");
    speakText("Measurement paused.");
  };

  const handleResume = () => {
    setMeasurementState("measuring");
    speakText("Resuming measurement. Keep walking along the field edge.");
    if (watchIdRef.current === null) {
      startGpsWatcher();
    }
  };

  const handleUndoLastPoint = () => {
    if (boundaryPoints.length <= 1) return;
    setBoundaryPoints((prev) => {
      const next = prev.slice(0, -1);
      setIsNearStart(false);
      speakText("Last point removed.");
      return next;
    });
  };

  const handleConfirmCancel = () => {
    stopTracking();
    setBoundaryPoints([]);
    setWalkedPath([]);
    setWalkedDistanceMeters(0);
    setIsNearStart(false);
    setShowCancelModal(false);
    setMeasurementState("idle");
    speakText("Measurement cancelled.");
  };

  const handleFinishField = () => {
    stopTracking();

    if (boundaryPoints.length < 3) {
      setGpsErrorMsg("Please walk around at least 3 corner points of your field to close the shape.");
      return;
    }

    setMeasurementState("finished");
    speakText("Field boundary completed. Check your calculated field area and save.");
  };

  const handleSaveField = () => {
    if (boundaryPoints.length < 3) return;

    const area = calculateGeodesicArea(boundaryPoints);
    const perimeter = calculatePerimeter(boundaryPoints, true);

    const avgAcc = accuracyHistory.length > 0
      ? Math.round(accuracyHistory.reduce((a, b) => a + b, 0) / accuracyHistory.length)
      : (currentAccuracy || 10);
    const worstAcc = accuracyHistory.length > 0
      ? Math.max(...accuracyHistory)
      : (currentAccuracy || 15);

    const record: SavedFieldRecord = {
      fieldId: `FIELD_${Math.floor(100000 + Math.random() * 900000)}`,
      boundaryPoints,
      areaSqMeters: area.sqMeters,
      areaHectares: area.hectares,
      areaAcres: area.acres,
      perimeterMeters: perimeter,
      pointCount: boundaryPoints.length,
      averageAccuracyMeters: avgAcc,
      worstAccuracyMeters: worstAcc,
      measuredAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      isConfirmed: true,
    };

    setSavedRecord(record);
    setMeasurementState("saved");
    speakText(`Field saved! Estimated area is ${area.hectares} hectares.`);

    // Trigger parent callback
    onBoundaryConfirmed(boundaryPoints, area.acres, record);
  };

  const handleMeasureAgain = () => {
    stopTracking();
    setBoundaryPoints([]);
    setWalkedPath([]);
    setWalkedDistanceMeters(0);
    setIsNearStart(false);
    setSavedRecord(null);
    setMeasurementState("idle");
  };

  // Derived Calculations for Finished View
  const calculatedArea = calculateGeodesicArea(boundaryPoints);
  const calculatedPerimeter = calculatePerimeter(boundaryPoints, true);

  return (
    <div className="w-full space-y-4 font-sans text-slate-100">
      {/* HEADER BAR & AUDIO TOGGLE */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              GPS Field Measurement
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                REAL-TIME GIS
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Walk around your field perimeter to calculate exact area & boundary.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1 transition-all ${
              audioEnabled
                ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle Farmer Voice Instructions"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            title="Measurement Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ERROR / WARNING BANNER */}
      {gpsErrorMsg && (
        <div className="bg-amber-950/80 border border-amber-600/80 p-3.5 rounded-2xl flex items-center justify-between text-amber-200 text-xs shadow-md">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{gpsErrorMsg}</span>
          </div>
          {gpsStatus === "denied" && (
            <button
              onClick={startGpsWatcher}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* IDLE / START SCREEN */}
      {measurementState === "idle" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Navigation className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Ready to Measure Field</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Walk around the edge of your field. We will continuously track your GPS position and calculate its exact area in Hectares and Acres.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs text-slate-300">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">1</span>
              <span>Walk along the field boundary</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">2</span>
              <span>Watch the live path on the map</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">3</span>
              <span>Tap Finish when back at start</span>
            </div>
          </div>

          <button
            onClick={handleStartMeasurement}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>START FIELD MEASUREMENT</span>
          </button>
        </div>
      )}

      {/* LIVE MAP & MEASUREMENT CONTROLS */}
      {(measurementState === "measuring" ||
        measurementState === "paused" ||
        measurementState === "finished" ||
        measurementState === "saved") && (
        <div className="space-y-4">
          {/* STATS METRICS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-lg text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Signal</span>
              <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${gpsStatus === "active" ? "bg-emerald-400" : "bg-amber-400 animate-ping"}`}></span>
                {currentAccuracy ? `±${currentAccuracy}m (${currentAccuracy <= 10 ? "Good" : "Fair"})` : "Searching..."}
              </span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance Walked</span>
              <span className="text-sm font-extrabold text-amber-400 mt-0.5 block">
                {walkedDistanceMeters} meters
              </span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Boundary Points</span>
              <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">
                {boundaryPoints.length} points
              </span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="text-sm font-extrabold text-white mt-0.5 block capitalize">
                {measurementState === "measuring" && <span className="text-emerald-400">Measuring...</span>}
                {measurementState === "paused" && <span className="text-amber-400">Paused</span>}
                {measurementState === "finished" && <span className="text-blue-400">Ready to Save</span>}
                {measurementState === "saved" && <span className="text-emerald-400">Saved</span>}
              </span>
            </div>
          </div>

          {/* NEAR START PROXIMITY ALERT */}
          {isNearStart && measurementState === "measuring" && (
            <div className="bg-emerald-950 border border-emerald-600 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-200 animate-bounce shadow-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold">You are near the starting point! Tap Finish Field to close the field.</span>
              </div>
              <button
                onClick={handleFinishField}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase shadow-md shrink-0"
              >
                Finish Field Now
              </button>
            </div>
          )}

          {/* LIVE LEAFLET SATELLITE MAP CONTAINER */}
          <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* MAP OVERLAY FLOATING CONTROLS */}
            <div className="absolute top-3 right-3 z-[1000] flex flex-col space-y-2">
              <button
                onClick={() => {
                  if (mapRef.current && currentPosition) {
                    mapRef.current.setView(currentPosition, 19, { animate: true });
                  }
                }}
                className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 rounded-xl shadow-lg text-xs flex items-center space-x-1"
                title="Recenter Map on Farmer"
              >
                <Maximize2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* MAP LEGEND BADGE */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-300 flex items-center space-x-3 shadow-lg">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></span>
                <span>Farmer</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-0.5 bg-amber-400"></span>
                <span>Walked Path</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Field Polygon</span>
              </div>
            </div>
          </div>

          {/* MEASUREMENT CONTROLS BUTTONS */}
          {(measurementState === "measuring" || measurementState === "paused") && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {measurementState === "measuring" ? (
                <button
                  onClick={handlePause}
                  className="py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm"
                >
                  <Pause className="w-5 h-5 fill-current" />
                  <span>PAUSE</span>
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>RESUME</span>
                </button>
              )}

              <button
                onClick={handleFinishField}
                disabled={boundaryPoints.length < 3}
                className={`py-3.5 font-black rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all ${
                  boundaryPoints.length >= 3
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>FINISH FIELD</span>
              </button>

              <button
                onClick={handleUndoLastPoint}
                disabled={boundaryPoints.length <= 1}
                className={`py-3.5 font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all ${
                  boundaryPoints.length > 1
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                    : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>UNDO POINT</span>
              </button>

              <button
                onClick={() => setShowCancelModal(true)}
                className="py-3.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>CANCEL</span>
              </button>
            </div>
          )}

          {/* FINISHED MEASUREMENT SUMMARY CARD */}
          {(measurementState === "finished" || measurementState === "saved") && (
            <div className="bg-slate-900/90 border border-emerald-800/80 p-5 sm:p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {measurementState === "saved" ? "FIELD SAVED & CONFIRMED" : "MEASUREMENT COMPLETED"}
                  </span>
                  <h3 className="text-lg font-black text-white">Estimated Field Boundary Results</h3>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              </div>

              {/* AREA & PERIMETER DISPLAY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-950/60 border border-emerald-700/60 p-4 rounded-xl">
                  <span className="text-xs text-emerald-300 font-bold block">Estimated Area</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {calculatedArea.hectares} <span className="text-sm font-semibold text-emerald-300">Hectares</span>
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    ({calculatedArea.acres} Acres / {calculatedArea.sqMeters.toLocaleString()} m²)
                  </span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                  <span className="text-xs text-slate-300 font-bold block">Field Perimeter</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    {calculatedPerimeter} <span className="text-xs font-semibold text-slate-400">meters</span>
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">Walked Boundary Line</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                  <span className="text-xs text-slate-300 font-bold block">Recorded Vertices</span>
                  <span className="text-xl font-black text-white mt-1 block">
                    {boundaryPoints.length} <span className="text-xs font-semibold text-slate-400">GPS Points</span>
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Avg Accuracy: ±{currentAccuracy || 8}m
                  </span>
                </div>
              </div>

              {/* FARMER CONFIRMATION PROMPT */}
              {measurementState === "finished" && (
                <div className="pt-2 space-y-3">
                  <p className="text-xs text-center text-slate-300">
                    Is this the field you measured? Confirm to save this boundary for crop & yield predictions.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleSaveField}
                      className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Save className="w-5 h-5" />
                      <span>SAVE FIELD</span>
                    </button>
                    <button
                      onClick={handleMeasureAgain}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>MEASURE AGAIN</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SAVED STATE SUCCESS ACTION */}
              {measurementState === "saved" && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {onContinueToCropAnalysis && (
                    <button
                      onClick={onContinueToCropAnalysis}
                      className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>CONTINUE TO CROP ANALYSIS</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleMeasureAgain}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>MEASURE ANOTHER FIELD</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-center">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-extrabold text-white">Cancel Field Measurement?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to cancel? All recorded GPS boundary points for this session will be discarded.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                Keep Measuring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP & GUIDANCE MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-400" />
                How to Measure Your Field
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <strong className="text-emerald-400 block mb-1">1. Walk the Boundary:</strong>
                Start at any corner of your field and tap <strong>Start Field Measurement</strong>. Walk along the exact edge or boundary line.
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <strong className="text-amber-400 block mb-1">2. Continuous Path:</strong>
                The app automatically records your position as you walk. You do not need to click on the map manually.
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <strong className="text-blue-400 block mb-1">3. Finish Field:</strong>
                When you return near your starting point, tap <strong>Finish Field</strong> to close the polygon and calculate exact Hectares & Acres.
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
