import { AREAS } from '@/src/constants/areas';
import { AreaKey } from '@/src/types/area';
import { Bbox } from '@/src/types/leafletDraw';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AnalysisState {
  selectedArea: AreaKey;
  selectedBbox: Bbox;
  position: [number, number];
  landArea: number;
  price: string;
  // 액션을 상태와 분리하여 관리 (Best Practice)
  actions: {
    changeArea: (area: AreaKey) => void;
    changeBbox: (bbox: Bbox) => void;
    changeLandArea: (landArea: number) => void;
    changeAreaPrice: (price: string) => void;
  };
}

export const useAnalysisStore = create(
  subscribeWithSelector<AnalysisState>((set) => ({
    selectedArea: 'pyeongtaek',
    selectedBbox: null,
    position: AREAS['pyeongtaek'].center,
    landArea: 0,
    price: '',
    actions: {
      changeArea: (area: AreaKey) => set({ selectedArea: area }),
      changeBbox: (bbox: Bbox) => set({ selectedBbox: bbox }),
      changeLandArea: (landArea: number) => set({ landArea }),
      changeAreaPrice: (price: string) => set({ price }),
    },
  }))
);

useAnalysisStore.subscribe(
  (store) => store.selectedArea,
  (newArea, prevArea) => {
    console.log(newArea);
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

export const useAnalysisActions = () => {
  return useAnalysisStore((state) => state.actions);
};
