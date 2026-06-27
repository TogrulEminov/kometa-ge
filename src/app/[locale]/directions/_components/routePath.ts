export function getBearing(from: [number, number], to: [number, number]) {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(dLon);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function segmentLength(from: [number, number], to: [number, number]) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function interpolateAlongRoute(
  positions: [number, number][],
  progress: number,
): [number, number, number] {
  if (positions.length < 2) {
    return [positions[0]?.[0] ?? 0, positions[0]?.[1] ?? 0, 0];
  }

  const segments = positions.slice(0, -1).map((from, index) => {
    const to = positions[index + 1];
    return { from, to, len: segmentLength(from, to) };
  });

  const totalLength = segments.reduce((sum, segment) => sum + segment.len, 0);
  if (totalLength === 0) {
    return [positions[0][0], positions[0][1], 0];
  }

  let remaining = progress * totalLength;

  for (const segment of segments) {
    if (remaining <= segment.len || segment === segments[segments.length - 1]) {
      const t = segment.len === 0 ? 0 : remaining / segment.len;
      const lat = segment.from[0] + (segment.to[0] - segment.from[0]) * t;
      const lng = segment.from[1] + (segment.to[1] - segment.from[1]) * t;

      return [lat, lng, getBearing(segment.from, segment.to)];
    }

    remaining -= segment.len;
  }

  const last = positions[positions.length - 1];
  const prev = positions[positions.length - 2];

  return [last[0], last[1], getBearing(prev, last)];
}

export function getRoutePointAt(
  positions: [number, number][],
  progress: number,
): {
  point: [number, number];
  segmentFrom: [number, number];
  segmentTo: [number, number];
} {
  if (positions.length < 2) {
    const point = positions[0] ?? [0, 0];
    return { point, segmentFrom: point, segmentTo: point };
  }

  const segments = positions.slice(0, -1).map((from, index) => {
    const to = positions[index + 1];
    return { from, to, len: segmentLength(from, to) };
  });

  const totalLength = segments.reduce((sum, segment) => sum + segment.len, 0);
  if (totalLength === 0) {
    return {
      point: positions[0],
      segmentFrom: positions[0],
      segmentTo: positions[1] ?? positions[0],
    };
  }

  let remaining = progress * totalLength;

  for (const segment of segments) {
    if (remaining <= segment.len || segment === segments[segments.length - 1]) {
      const t = segment.len === 0 ? 0 : remaining / segment.len;
      const lat = segment.from[0] + (segment.to[0] - segment.from[0]) * t;
      const lng = segment.from[1] + (segment.to[1] - segment.from[1]) * t;

      return {
        point: [lat, lng],
        segmentFrom: segment.from,
        segmentTo: segment.to,
      };
    }

    remaining -= segment.len;
  }

  const last = positions[positions.length - 1];
  const prev = positions[positions.length - 2];

  return { point: last, segmentFrom: prev, segmentTo: last };
}
