"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { cn } from "@/utils/cn";
import {
  getFreightRouteByIso,
  getGreatCircleRouteLatLngs,
  worldGeoData,
  type FreightRoute,
} from "./freightRoutes";
import {
  RouteAnimatedDashLine,
  RouteBaseLine,
  RouteGlowLine,
} from "./AnimatedRouteLine";
import AnimatedRouteVehicle from "./AnimatedRouteVehicle";

const FROM_COLOR = "#3B82F6";
const TO_COLOR = "#B11226";

function toLatLng([lng, lat]: [number, number]): [number, number] {
  return [lat, lng];
}

function getRouteLatLngs(route: FreightRoute): [number, number][] {
  return getGreatCircleRouteLatLngs(route.from.coords, route.to.coords);
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
          "surface-card p-8 text-center text-muted text-sm",
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
        fillOpacity: 0.35,
        color: TO_COLOR,
        weight: 2.5,
        opacity: 0.95,
        interactive: false,
      };
    }
    if (iso === fromCode) {
      return {
        fillColor: FROM_COLOR,
        fillOpacity: 0.32,
        color: FROM_COLOR,
        weight: 2.5,
        opacity: 0.95,
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
    <div className={cn("route-map-root surface-card overflow-hidden", className)}>
      <div className="relative isolate z-0 h-[min(520px,70vw)] min-h-[360px] w-full [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:cursor-grab [&_.leaflet-container.leaflet-dragging]:cursor-grabbing">
        <MapContainer
          key={`${fromCode}-${toCode}`}
          center={mapCenter}
          zoom={4}
          scrollWheelZoom
          dragging
          touchZoom
          doubleClickZoom
          zoomControl
          style={{ height: "100%", width: "100%", background: "#0b0f1a" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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

          <RouteBaseLine positions={routePositions} />
          <RouteGlowLine positions={routePositions} />
          <RouteAnimatedDashLine positions={routePositions} />

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

          <AnimatedRouteVehicle positions={routePositions} />
          <FitRouteBounds positions={routePositions} />
        </MapContainer>

        <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-xl border border-white/10 bg-background/85 p-3 text-xs text-foreground shadow-2xl backdrop-blur-md">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#3B82F6]" />
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
