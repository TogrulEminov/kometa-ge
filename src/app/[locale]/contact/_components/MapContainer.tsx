"use client";
import { IContactInformation } from "@/services/interface/type";
import dynamic from "next/dynamic";

const MapBox = dynamic(() => import("./atoms/MapBox"), { ssr: false });

export default function MapContainerBox({ contactInfo }: { contactInfo: IContactInformation }) {
  return <MapBox contactInfo={contactInfo} />;
}
