// GIS Field Measurement Service
// Handles geodesic surface calculations for field boundaries measured via real-time GPS tracking.

export interface SavedFieldRecord {
  fieldId: string;
  farmerId?: string;
  boundaryPoints: [number, number][]; // [[lat, lng], ...]
  areaSqMeters: number;
  areaHectares: number;
  areaAcres: number;
  perimeterMeters: number;
  pointCount: number;
  averageAccuracyMeters: number;
  worstAccuracyMeters: number;
  measuredAt: string;
  isConfirmed: boolean;
  notes?: string;
}

/**
 * Calculates distance in meters between two lat/lng coordinates using the Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) *
      Math.cos(lat2 * rad) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates total perimeter in meters along an array of boundary points.
 */
export function calculatePerimeter(coords: [number, number][], isClosed = true): number {
  if (!coords || coords.length < 2) return 0;
  let totalMeters = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    totalMeters += calculateHaversineDistance(
      coords[i][0],
      coords[i][1],
      coords[i + 1][0],
      coords[i + 1][1]
    );
  }
  if (isClosed && coords.length >= 3) {
    totalMeters += calculateHaversineDistance(
      coords[coords.length - 1][0],
      coords[coords.length - 1][1],
      coords[0][0],
      coords[0][1]
    );
  }
  return Number(totalMeters.toFixed(1));
}

/**
 * Calculates geodesic planar area of a closed polygon on Earth in square meters, hectares, and acres.
 */
export function calculateGeodesicArea(coords: [number, number][]): {
  sqMeters: number;
  hectares: number;
  acres: number;
} {
  if (!coords || coords.length < 3) return { sqMeters: 0, hectares: 0, acres: 0 };

  const R = 6371000; // Earth radius in meters
  const numPoints = coords.length;

  let meanLatRad = 0;
  for (let i = 0; i < numPoints; i++) {
    meanLatRad += (coords[i][0] * Math.PI) / 180;
  }
  meanLatRad /= numPoints;

  const cosMeanLat = Math.cos(meanLatRad);

  let areaSqMeters = 0;
  for (let i = 0; i < numPoints; i++) {
    const j = (i + 1) % numPoints;
    const x1 = coords[i][1] * (Math.PI / 180) * R * cosMeanLat;
    const y1 = coords[i][0] * (Math.PI / 180) * R;
    const x2 = coords[j][1] * (Math.PI / 180) * R * cosMeanLat;
    const y2 = coords[j][0] * (Math.PI / 180) * R;

    areaSqMeters += x1 * y2 - x2 * y1;
  }

  const finalSqM = Math.abs(areaSqMeters) / 2;
  const finalHectares = finalSqM / 10000;
  const finalAcres = finalSqM / 4046.8564224;

  return {
    sqMeters: Number(finalSqM.toFixed(1)),
    hectares: Number(finalHectares.toFixed(2)),
    acres: Number(finalAcres.toFixed(2)),
  };
}
