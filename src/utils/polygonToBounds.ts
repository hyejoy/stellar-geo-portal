export function polygonToBounds(polygon) {
  const lats = polygon.map((p) => p.lat);
  const lngs = polygon.map((p) => p.lng);

  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}
