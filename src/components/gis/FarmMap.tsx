import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Farm } from "../../types";
import { Layers, MapPin, Eye, Compass, Maximize2 } from "lucide-react";

interface FarmMapProps {
  farms?: Farm[];
  selectedFarmId?: string;
  onSelectFarm?: (farm: Farm) => void;
  activeLayer?: "satellite" | "ndvi" | "moisture" | "vegetation";
  selectableLocation?: boolean;
  onLocationPicked?: (lat: number, lng: number) => void;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  farms = [],
  selectedFarmId,
  onSelectFarm,
  activeLayer = "satellite",
  selectableLocation = false,
  onLocationPicked,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const polygonRef = useRef<L.LayerGroup | null>(null);

  const [currentLayer, setCurrentLayer] = useState<"satellite" | "ndvi" | "moisture" | "vegetation">(activeLayer);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default map center: Andhra Pradesh / Guntur farm region
      const defaultLat = farms.length > 0 ? farms[0].lat : 16.243;
      const defaultLng = farms.length > 0 ? farms[0].lng : 80.648;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add base tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors | Sentinel-2 GIS Data',
        maxZoom: 19,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      polygonRef.current = L.layerGroup().addTo(map);

      if (selectableLocation) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setSelectedCoords({ lat, lng });
          if (onLocationPicked) onLocationPicked(lat, lng);
        });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers & layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersRef.current || !polygonRef.current) return;

    markersRef.current.clearLayers();
    polygonRef.current.clearLayers();

    // Render registered farm pins & boundaries
    farms.forEach((farm) => {
      const isSelected = farm.id === selectedFarmId;

      // Custom Icon
      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: `<div class="w-8 h-8 rounded-full ${
          isSelected ? "bg-emerald-500 ring-4 ring-emerald-300 scale-110" : "bg-emerald-800"
        } text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
          🌾
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([farm.lat, farm.lng], { icon: customIcon });
      marker.bindPopup(`
        <div class="p-2 text-slate-800">
          <h4 class="font-bold text-sm">${farm.farmName}</h4>
          <p class="text-xs">Farmer: ${farm.farmerName}</p>
          <p class="text-xs">Crop: ${farm.crop}</p>
          <p class="text-xs">Area: ${farm.areaAcres} Acres</p>
          <p class="text-xs font-semibold text-emerald-700">Health Index: ${farm.healthScore}/100</p>
        </div>
      `);

      marker.on("click", () => {
        if (onSelectFarm) onSelectFarm(farm);
      });

      markersRef.current?.addLayer(marker);

      // Render polygon boundary if available
      if (farm.boundaryPoints && farm.boundaryPoints.length > 2) {
        const polygonColor = currentLayer === "ndvi" ? "#10b981" : currentLayer === "moisture" ? "#3b82f6" : "#f59e0b";
        const polygon = L.polygon(farm.boundaryPoints, {
          color: polygonColor,
          weight: isSelected ? 3 : 2,
          fillColor: polygonColor,
          fillOpacity: isSelected ? 0.45 : 0.25,
        });
        polygonRef.current?.addLayer(polygon);
      }
    });

    // Render selected location pin if picking mode
    if (selectedCoords) {
      const pinIcon = L.divIcon({
        className: "custom-pick-pin",
        html: `<div class="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white animate-bounce">
          📍
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const pickMarker = L.marker([selectedCoords.lat, selectedCoords.lng], { icon: pinIcon });
      markersRef.current.addLayer(pickMarker);
    }
  }, [farms, selectedFarmId, currentLayer, selectedCoords]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-emerald-800/80 shadow-2xl">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-emerald-950" />

      {/* Top Floating Map Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-emerald-950/90 backdrop-blur-md border border-emerald-700/80 p-1.5 rounded-xl shadow-lg">
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-emerald-300">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Layer:</span>
        </div>
        {[
          { id: "satellite", label: "Satellite Base" },
          { id: "ndvi", label: "NDVI Vegetation" },
          { id: "moisture", label: "Moisture Index" },
          { id: "vegetation", label: "Canopy Density" },
        ].map((layer) => (
          <button
            key={layer.id}
            onClick={() => setCurrentLayer(layer.id as any)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              currentLayer === layer.id
                ? "bg-emerald-500 text-emerald-950 font-bold shadow"
                : "text-emerald-200 hover:bg-emerald-900"
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-emerald-950/90 backdrop-blur-md border border-emerald-800 p-2.5 rounded-xl text-[11px] text-white shadow-lg space-y-1">
        <div className="font-semibold text-emerald-300 flex items-center gap-1 mb-1">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>GIS Spectral Index Legend ({currentLayer.toUpperCase()})</span>
        </div>
        {currentLayer === "ndvi" && (
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-500" /> Barren/Low (-0.1)
            <span className="w-3 h-3 rounded bg-yellow-400 ml-2" /> Moderate (0.4)
            <span className="w-3 h-3 rounded bg-emerald-500 ml-2" /> Lush Canopy (0.8+)
          </div>
        )}
        {currentLayer === "moisture" && (
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-400" /> Dry Stress
            <span className="w-3 h-3 rounded bg-cyan-400 ml-2" /> Optimal Water
            <span className="w-3 h-3 rounded bg-blue-600 ml-2" /> Saturated Soil
          </div>
        )}
        {currentLayer === "satellite" && (
          <div className="text-emerald-200/80">
            Sentinel-2 Optical Resolution: 10m / pixel
          </div>
        )}
      </div>

      {/* Pin picking notification if active */}
      {selectableLocation && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500/20 border border-amber-500/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium text-amber-200 shadow-md animate-pulse">
          📍 Click on map to pinpoint Farm GPS location
        </div>
      )}
    </div>
  );
};
