"use client";
import dynamic from "next/dynamic";

const MapBox = dynamic(() => import("./atoms/MapBox"), { ssr: false });

export default function MapContainerBox() {
  return <MapBox />;
}
