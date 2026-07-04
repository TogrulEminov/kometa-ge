import type { FeatureCollection } from "geojson";
import worldGeoJson from "@public/world.geo.json";

interface CountryProperties {
  ADMIN?: string | null;
  ADM0_A3?: string | null;
}

export interface CountryOption {
  value: string;
  label: string;
}

const worldGeoData = worldGeoJson as unknown as FeatureCollection;

const COUNTRY_NAME_BY_ISO = new Map<string, string>();

function buildCountryMaps() {
  for (const feature of worldGeoData.features) {
    const props = feature.properties as CountryProperties | null;
    const iso = props?.ADM0_A3?.trim();
    const name = props?.ADMIN?.trim();

    if (!iso || !name || COUNTRY_NAME_BY_ISO.has(iso)) continue;

    COUNTRY_NAME_BY_ISO.set(iso, name);
  }
}

buildCountryMaps();

export function getCountryNameByIso(iso: string | null | undefined): string {
  if (!iso) return "";
  return COUNTRY_NAME_BY_ISO.get(iso.trim()) ?? "";
}

export function getCountrySelectOptions(): CountryOption[] {
  return Array.from(COUNTRY_NAME_BY_ISO.entries())
    .map(([iso, name]) => ({
      value: iso,
      label: `${name} (${iso})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export const COUNTRY_SELECT_OPTIONS = getCountrySelectOptions();
