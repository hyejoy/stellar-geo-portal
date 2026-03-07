import { AREAS } from '@/src/constants/areas';
import { AnalysisOrder } from '@/src/types/analysis';
import { AreaKey } from '@/src/types/area';
import { Bbox } from '@/src/types/leafletDraw';
import { TrendChart } from '@/src/types/NDVI';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const currentYear = new Date().getFullYear();

export type AnalysisType = 'ndvi' | 'sar';

interface AnalysisState {
  analysisOrder: AnalysisOrder | null; // 마지막 주문
  selectedArea: AreaKey;
  selectedBbox: Bbox;
  position: [number, number];
  landArea: number;
  price: string;
  selectedStartYear: number | null;
  selectedEndYear: number | null;
  analysisType: AnalysisType;
  satellite: string;
  resultTrendChart: TrendChart;
  actions: {
    changeArea: (area: AreaKey) => void;
    changeBbox: (bbox: Bbox) => void;
    changeLandArea: (landArea: number) => void;
    changeAreaPrice: (price: string) => void;
    changeSelectedStartYear: (year: number | null) => void;
    changeSelectedEndYear: (year: number | null) => void;
    setAnalysisOrder: (order: AnalysisOrder) => void;
    changeAnalysisType: (type: AnalysisType) => void;
    resetLandAreaAndPrice: () => void;
    setResultTrendChart: (trendChart: TrendChart) => void;
  };
}

export const useAnalysisStore = create(
  subscribeWithSelector<AnalysisState>((set) => ({
    analysisOrder: null,
    selectedArea: 'pyeongtaek',
    selectedBbox: null,
    position: AREAS['pyeongtaek'].center,
    landArea: 0,
    price: '',
    selectedStartYear: currentYear - 2,
    selectedEndYear: currentYear,
    analysisType: 'sar',
    satellite: 'sentinel-1-grd',
    resultTrendChart: [],
    actions: {
      changeArea: (area: AreaKey) => set({ selectedArea: area }),
      changeBbox: (bbox: Bbox) => set({ selectedBbox: bbox }),
      changeLandArea: (landArea: number) => set({ landArea }),
      changeAreaPrice: (price: string) => set({ price }),
      changeSelectedStartYear: (year: number | null) => set({ selectedStartYear: year }),
      changeSelectedEndYear: (year: number | null) => set({ selectedEndYear: year }),
      setAnalysisOrder: (analysisOrder: AnalysisOrder) => set({ analysisOrder }),
      changeAnalysisType: (type) =>
        set({
          analysisType: type,
          satellite: type === 'ndvi' ? 'sentinel-2-l2a' : 'sentinel-1-grd',
        }),
      resetLandAreaAndPrice: () =>
        set({
          landArea: 0,
          price: '',
        }),
      setResultTrendChart: (trandChart: TrendChart) =>
        set({
          resultTrendChart: trandChart,
        }),
    },
  }))
);

useAnalysisStore.subscribe(
  (store) => store.selectedArea,
  (newArea, prevArea) => {
    console.log(',.', newArea);
    console.log(prevArea);
    if (newArea === prevArea) return;
    useAnalysisStore.setState({
      position: AREAS[newArea].center,
    });
  }
);
useAnalysisStore.subscribe(
  (store) => store.position,
  (newP, prev) => {
    console.log(newP);
    console.log(prev);
  }
);

export const useSelectedArea = () => {
  const area = useAnalysisStore((state) => state.selectedArea);
  return area;
};

export const useSelectedBbox = () => {
  const bbox = useAnalysisStore((state) => state.selectedBbox);
  return bbox;
};

export const useSelectedPosition = () => {
  const positon = useAnalysisStore((state) => state.position);
  return positon;
};

export const useLandArea = () => {
  const landArea = useAnalysisStore((state) => state.landArea);
  return landArea;
};

export const useAreaPrice = () => {
  const price = useAnalysisStore((state) => state.price);
  return price;
};

export const useSelectedYears = () => {
  const selectedStartYear = useAnalysisStore((state) => state.selectedStartYear);
  const selectedEndYear = useAnalysisStore((state) => state.selectedEndYear);
  return { selectedStartYear, selectedEndYear };
};

export const useAnalysisType = () => {
  const analysisType = useAnalysisStore((state) => state.analysisType);
  const satellite = useAnalysisStore((state) => state.satellite);
  return { analysisType, satellite };
};

export const useAnalysisOrder = () => {
  const analysisOrder = useAnalysisStore((state) => state.analysisOrder);
  return analysisOrder;
};

export const useNDVITrendChart = () => {
  const chart = useAnalysisStore((state) => state.resultTrendChart);
  return chart;
};

export const useAnalysisActions = () => {
  return useAnalysisStore((state) => state.actions);
};
