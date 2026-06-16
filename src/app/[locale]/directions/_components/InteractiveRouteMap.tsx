"use client";

import dynamic from "next/dynamic";
import { cn } from "@/utils/cn";

export {
  getCountryByIso,
  getFreightRouteByIso,
  worldGeoData,
  type FreightRoute,
  type RoutePoint,
} from "./freightRoutes";

const RouteMapView = dynamic(() => import("./RouteMapView"), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        "flex h-[min(520px,70vw)] min-h-[360px] w-full items-center justify-center",
        "rounded-2xl border border-gray-100 bg-[#eef1f5] text-secondary/50 text-sm",
      )}
    >
      Loading map...
    </div>
  ),
});

interface InteractiveRouteMapProps {
  fromIso: string;
  toIso: string;
  className?: string;
  language?: "en" | "az";
}

export default function InteractiveRouteMap(props: InteractiveRouteMapProps) {
  return <RouteMapView {...props} />;
}
