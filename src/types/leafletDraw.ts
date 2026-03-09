export interface DrawOptions {
  polyline?: boolean;
  polygon?: boolean;
  rectangle?: boolean;
  circle?: boolean;
  marker?: boolean;
  circlemarker?: boolean;
}
export type RectangleBbox = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type PolygonBbox = {
  lat: number;
  lng: number;
}[];
export type Bbox = RectangleBbox | PolygonBbox;
