"use client";

import { useEffect, useRef } from "react";
import { Polyline } from "react-leaflet";
import type L from "leaflet";

const ROUTE_COLOR = "#B11226";
const ROUTE_GLOW_COLOR = "#F87171";

export function RouteBaseLine({
  positions,
}: {
  positions: [number, number][];
}) {
  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: ROUTE_COLOR,
        weight: 2,
        opacity: 0.22,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }}
    />
  );
}

export function RouteGlowLine({
  positions,
}: {
  positions: [number, number][];
}) {
  const polylineRef = useRef<L.Polyline>(null);

  useEffect(() => {
    let frame = 0;
    let phase = 0;

    const animate = () => {
      const path = polylineRef.current?.getElement() as SVGPathElement | undefined;
      if (path) {
        phase += 0.035;
        path.style.opacity = String(0.14 + Math.sin(phase) * 0.08);
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [positions]);

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      pathOptions={{
        color: ROUTE_GLOW_COLOR,
        weight: 12,
        opacity: 0.18,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }}
    />
  );
}

export function RouteAnimatedDashLine({
  positions,
}: {
  positions: [number, number][];
}) {
  const polylineRef = useRef<L.Polyline>(null);

  useEffect(() => {
    let frame = 0;
    let dashOffset = 0;

    const animate = () => {
      const path = polylineRef.current?.getElement() as SVGPathElement | undefined;
      if (path) {
        dashOffset = (dashOffset + 0.75) % 56;
        path.style.strokeDashoffset = `${-dashOffset}`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [positions]);

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      pathOptions={{
        color: ROUTE_COLOR,
        weight: 4,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "18 14",
        interactive: false,
      }}
    />
  );
}
