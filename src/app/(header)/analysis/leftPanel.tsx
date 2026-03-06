'use client';
import {
  useSelectedArea,
  useSelectedBbox,
  useAnalysisActions,
} from '@/src/app/store/analysisStore';
import { AREA_ARRAY, AREAS } from '@/src/constants/areas';
import { AreaKey } from '@/src/types/area';
import { ChangeEvent, useMemo } from 'react';
import ListCard from '../../components/ListCard';
import SelectBox from '@/src/app/components/ui/SelectBox';

export default function LeftPanel() {
  /** zustand */
  const area = useSelectedArea();
  const bbox = useSelectedBbox();
  const { changeArea } = useAnalysisActions();

  const selected = useMemo(() => AREAS[area], [area]);

  const handleAread = (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
    changeArea(e.target.value as AreaKey);
  };
  const areaOptions = Object.entries(AREAS).map(([key, v]) => ({
    value: key,
    label: v.name,
  }));
  return (
    <>
      <div className="w-107.5 space-y-4 border-r p-4">
        <h2 className="text-xl font-bold">분석할 산업단지를 선택하세요.</h2>

        <SelectBox
          value={area}
          placeholder="산업단지 선택..."
          options={Object.entries(AREAS).map(([key, v]) => ({
            value: key,
            label: v.name,
          }))}
          onChange={handleAread}
        />

        <div className="no-scrollbar flex h-[650px] flex-col overflow-scroll rounded-2xl bg-gray-600">
          {AREA_ARRAY.map((item) => (
            <ListCard
              keyName={item}
              title={AREAS[item].name}
              description={AREAS[item].description}
              key={item}
              lastUpdate={AREAS[item].lastUpdateDate}
              checked={area === item}
            />
          ))}
        </div>
      </div>
    </>
  );
}
