"use client";

import { useEffect, useState } from "react";

/**
 * Delays map mount until after client hydration and forces a clean
 * teardown/remount cycle when `mapKey` changes (avoids Leaflet container reuse).
 */
export function useRemountableMap(mapKey: string) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    setVisible(false);
    frame = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
    };
  }, [mapKey]);

  return visible;
}
