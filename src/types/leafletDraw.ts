export interface DrawOptions {
  polyline?: boolean;
  polygon?: boolean;
  rectangle?: boolean;
  circle?: boolean;
  marker?: boolean;
  circlemarker?: boolean;
}

export type Bbox =
  | {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  | {
      lat: number;
      lng: number;
    }[];
