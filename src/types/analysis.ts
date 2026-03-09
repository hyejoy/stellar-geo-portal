import { AreaKey } from '@/src/types/area';
import { Bbox } from '@/src/types/leafletDraw';

export type AnalysisOrder = {
  area: AreaKey;
  bbox: Bbox;
  startYear: number;
  endYear: number;
  landArea: number;
  price: string;
  orderedAt: string;
};

// export type AnalysisType = 'ndvi' | 'sar';
// export type Satellite = 'sentinel-1' | 'sentinel-2-l2a';
