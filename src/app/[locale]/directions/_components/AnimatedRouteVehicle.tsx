"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { getRoutePointAt } from "./routePath";

const LORRY_ICON_URL = "/assets/lorry.png";
const LORRY_ICON_SIZE = 64;
/** PNG cab faces right; +90° aligns cab with forward screen bearing. */
const LORRY_ICON_ROTATION = 90;
/** Wheels sit near the bottom edge of the PNG — pin route line slightly above here. */
const LORRY_WHEEL_RATIO = 0.875;
const ROUTE_DURATION_MS = 12000;
// Match map bearing immediately (no lag) to keep rotation consistent.
const BEARING_SMOOTHING = 1;
const LOOK_AHEAD = 0.035;

function getScreenBearing(
  map: L.Map,
  from: [number, number],
  to: [number, number],
) {
  const start = map.latLngToContainerPoint(L.latLng(from[0], from[1]));
  const end = map.latLngToContainerPoint(L.latLng(to[0], to[1]));
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return null;

  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

function smoothAngle(current: number, target: number, factor: number) {
  const delta = ((((target - current) % 360) + 540) % 360) - 180;
  return current + delta * factor;
}

const wheelAnchorY = Math.round(LORRY_ICON_SIZE * LORRY_WHEEL_RATIO);
const wheelOriginPercent = (wheelAnchorY / LORRY_ICON_SIZE) * 100;

const vehicleIconHtml = `
  <div class="route-vehicle-shell">
    <div class="route-vehicle-glow" aria-hidden="true"></div>
    <div class="route-vehicle-rotate" style="transform-origin: 50% ${wheelOriginPercent}%;">
      <img
        src="${LORRY_ICON_URL}"
        alt=""
        class="route-vehicle-image"
        width="${LORRY_ICON_SIZE}"
        height="${LORRY_ICON_SIZE}"
        draggable="false"
      />
    </div>
  </div>
`;

export default function AnimatedRouteVehicle({
  positions,
}: {
  positions: [number, number][];
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const frameRef = useRef<number | null>(null);
  const angleRef = useRef(LORRY_ICON_ROTATION);

  useEffect(() => {
    if (positions.length < 2) return;

    const icon = L.divIcon({
      className: "route-vehicle-marker",
      html: vehicleIconHtml,
      iconSize: [LORRY_ICON_SIZE, LORRY_ICON_SIZE],
      iconAnchor: [LORRY_ICON_SIZE / 2, wheelAnchorY],
    });

    const marker = L.marker(positions[0], {
      icon,
      interactive: false,
      zIndexOffset: 2000,
    }).addTo(map);

    markerRef.current = marker;

    const initialBearing = getScreenBearing(
      map,
      positions[0],
      positions[Math.min(4, positions.length - 1)],
    );
    angleRef.current = (initialBearing ?? 0) + LORRY_ICON_ROTATION;

    let startTime = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const progress = (elapsed % ROUTE_DURATION_MS) / ROUTE_DURATION_MS;

      const { point } = getRoutePointAt(positions, progress);
      const aheadT = Math.min(progress + LOOK_AHEAD, 1);
      const { point: aheadPoint } = getRoutePointAt(positions, aheadT);

      marker.setLatLng(point);

      const rotateEl = marker
        .getElement()
        ?.querySelector(".route-vehicle-rotate") as HTMLElement | null;

      if (rotateEl) {
        const bearing = getScreenBearing(map, point, aheadPoint);

        if (bearing !== null) {
          const targetAngle = bearing + LORRY_ICON_ROTATION;
          // Avoid bearing lag: align rotation to current computed bearing.
          angleRef.current = targetAngle;
          rotateEl.style.transform = `rotate(${angleRef.current}deg)`;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      const marker = markerRef.current;
      if (marker) {
        try {
          if (map.getPane("markerPane")) {
            marker.remove();
          }
        } catch {
          // Map already destroyed during React unmount.
        }
        markerRef.current = null;
      }
    };
  }, [map, positions, wheelAnchorY]);

  return null;
}
