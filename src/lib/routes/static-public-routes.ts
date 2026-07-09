import { CustomPath } from "@/services/interface/metadata-constant";

export const STATIC_PUBLIC_ROUTE_HREFS = [
  "/",
  "/about",
  "/services",
  "/directions",
  "/contact",
  "/certificates",
  "/photo-gallery",
  "/video-gallery",
] as const;

export type StaticPublicRouteHref = (typeof STATIC_PUBLIC_ROUTE_HREFS)[number];

export const STATIC_PUBLIC_ROUTE_CUSTOM_PATH: Record<
  StaticPublicRouteHref,
  CustomPath
> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/directions": "directions",
  "/contact": "contact",
  "/certificates": "certificates",
  "/photo-gallery": "photo-gallery",
  "/video-gallery": "video-gallery",
};
