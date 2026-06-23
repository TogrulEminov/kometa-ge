"use client";
import { IContactInformation } from "@/services/interface/type";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
const customIcon = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23b11226'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});


export default function MapBox({ contactInfo }: { contactInfo: IContactInformation }) {
  const latitude = contactInfo?.latitude ? parseFloat(contactInfo?.latitude) : 0;
  const longitude = contactInfo?.longitude ? parseFloat(contactInfo?.longitude) : 0;
  const t=useTranslations("atoms.components.contactInfo");
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>
          <div className="text-center">
            <div className="font-bold text-secondary text-sm">{t("company_name")}</div>
            <div className="text-xs text-gray-400">{t("head_office")}</div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
