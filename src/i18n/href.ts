import { ComponentProps } from "react";
import { Link } from "./navigation";

export type AppHref = ComponentProps<typeof Link>["href"];

export function serviceMainHref(category: string): AppHref {
  return {
    pathname: "/services/[category]",
    params: { category },
  };
}

export function serviceSubHref(category: string, slug: string): AppHref {
  return {
    pathname: "/services/[category]/[slug]",
    params: { category, slug },
  };
}

export function directionDetailHref(slug: string): AppHref {
  return {
    pathname: "/directions/[slug]",
    params: { slug },
  };
}
