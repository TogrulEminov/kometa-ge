import * as d3 from "d3";
import type { Feature, FeatureCollection } from "geojson";
import worldGeoJson from "@public/world.geo.json";

export const worldGeoData = worldGeoJson as unknown as FeatureCollection;

export interface RoutePoint {
  iso: string;
  name: string;
  coords: [number, number];
}

export interface FreightRoute {
  from: RoutePoint;
  to: RoutePoint;
}

function findCountryFeature(iso: string): Feature | undefined {
  const code = iso.toUpperCase();

  return worldGeoData.features.find(
    (feature) =>
      (feature.properties as { ADM0_A3?: string } | null)?.ADM0_A3 === code,
  );
}

export function getCountryByIso(iso: string): RoutePoint | undefined {
  const feature = findCountryFeature(iso);
  if (!feature) return undefined;

  const props = feature.properties as { ADMIN?: string; ADM0_A3?: string };
  const code = iso.toUpperCase();

  return {
    iso: code,
    name: props.ADMIN ?? code,
    coords: d3.geoCentroid(feature) as [number, number],
  };
}

export function getFreightRouteByIso(
  fromIso: string,
  toIso: string,
): FreightRoute | undefined {
  const from = getCountryByIso(fromIso);
  const to = getCountryByIso(toIso);

  if (!from || !to) return undefined;

  return { from, to };
}
