"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  GeoJSON,
  MapContainer,
  Polyline,
  TileLayer,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { cn } from "@/utils/cn";
import {
  getFreightRouteByIso,
  worldGeoData,
  type FreightRoute,
} from "./freightRoutes";

const FROM_COLOR = "#1E3A5F";
const TO_COLOR = "#C8102E";
const ROUTE_COLOR = "#1E3A5F";

/** GeoJSON / D3: [lng, lat] → Leaflet: [lat, lng] */
function toLatLng([lng, lat]: [number, number]): [number, number] {
  return [lat, lng];
}

function getRouteLatLngs(route: FreightRoute): [number, number][] {
  return [toLatLng(route.from.coords), toLatLng(route.to.coords)];
}

function FitRouteBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (positions.length < 2 || hasFitted.current) return;

    map.fitBounds(L.latLngBounds(positions), {
      padding: [48, 48],
      maxZoom: 6,
    });
    hasFitted.current = true;
  }, [map, positions]);

  return null;
}

export interface InteractiveRouteMapProps {
  fromIso: string;
  toIso: string;
  className?: string;
  language?: "en" | "az";
}

export default function RouteMapView({
  fromIso,
  toIso,
  className = "",
}: InteractiveRouteMapProps) {
  const fromCode = fromIso.toUpperCase();
  const toCode = toIso.toUpperCase();

  const route = useMemo(
    () => getFreightRouteByIso(fromIso, toIso),
    [fromIso, toIso],
  );

  const routePositions = useMemo(
    () => (route ? getRouteLatLngs(route) : []),
    [route],
  );

  const highlightedGeo = useMemo(() => {
    const features = worldGeoData.features.filter((feature) => {
      const iso = (feature.properties as { ADM0_A3?: string } | null)?.ADM0_A3;
      return iso === fromCode || iso === toCode;
    });

    if (features.length === 0) return null;

    return { type: "FeatureCollection" as const, features };
  }, [fromCode, toCode]);

  const mapCenter = useMemo((): [number, number] => {
    if (!route) return [42.5, 55];
    const [fromLat, fromLng] = toLatLng(route.from.coords);
    const [toLat, toLng] = toLatLng(route.to.coords);
    return [(fromLat + toLat) / 2, (fromLng + toLng) / 2];
  }, [route]);

  if (!route) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-gray-100 bg-white p-8 text-center text-secondary/60 text-sm",
          className,
        )}
      >
        Route not found.
      </div>
    );
  }

  const countryStyle = (iso?: string): L.PathOptions => {
    if (iso === toCode) {
      return {
        fillColor: TO_COLOR,
        fillOpacity: 0.28,
        color: TO_COLOR,
        weight: 2.5,
        opacity: 0.9,
        interactive: false,
      };
    }
    if (iso === fromCode) {
      return {
        fillColor: FROM_COLOR,
        fillOpacity: 0.28,
        color: FROM_COLOR,
        weight: 2.5,
        opacity: 0.9,
        interactive: false,
      };
    }
    return {
      fillOpacity: 0,
      opacity: 0,
      weight: 0,
      interactive: false,
    };
  };

  const onEachCountry = (
    feature: { properties?: { ADM0_A3?: string } },
    layer: L.Layer,
  ) => {
    const iso = feature.properties?.ADM0_A3;
    if (iso === fromCode || iso === toCode) {
      (layer as L.Path).setStyle(countryStyle(iso));
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm",
        className,
      )}
    >
      <div className="relative h-[min(520px,70vw)] min-h-[360px] w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:cursor-grab [&_.leaflet-container.leaflet-dragging]:cursor-grabbing">
        <MapContainer
          key={`${fromCode}-${toCode}`}
          center={mapCenter}
          zoom={4}
          scrollWheelZoom
          dragging
          touchZoom
          doubleClickZoom
          zoomControl
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <GeoJSON
            data={highlightedGeo ?? { type: "FeatureCollection", features: [] }}
            onEachFeature={onEachCountry}
            style={(feature) =>
              countryStyle(
                (feature as { properties?: { ADM0_A3?: string } }).properties
                  ?.ADM0_A3,
              )
            }
          />

          <Polyline
            positions={routePositions}
            pathOptions={{
              color: ROUTE_COLOR,
              weight: 4,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
              dashArray: "10 8",
              interactive: false,
            }}
          />

          <CircleMarker
            center={toLatLng(route.from.coords)}
            radius={9}
            pathOptions={{
              fillColor: FROM_COLOR,
              fillOpacity: 1,
              color: "#ffffff",
              weight: 3,
              interactive: false,
            }}
          />

          <CircleMarker
            center={toLatLng(route.to.coords)}
            radius={9}
            pathOptions={{
              fillColor: TO_COLOR,
              fillOpacity: 1,
              color: "#ffffff",
              weight: 3,
              interactive: false,
            }}
          />

          <FitRouteBounds positions={routePositions} />
        </MapContainer>

        <div className="pointer-events-none absolute bottom-4 left-4 z-1000 rounded-xl bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#1E3A5F]" />
            <span>
              {route.from.name} ({fromCode})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-primary" />
            <span>
              {route.to.name} ({toCode})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
