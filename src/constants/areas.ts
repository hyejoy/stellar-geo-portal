import { AreaKey } from "@/src/types/area";

export const AREAS: Record<
  AreaKey,
  {
    name: string;
    description: string;
    center: [number, number];
    lastUpdateDate: Date;
  }
> = {
  pyeongtaek: {
    name: "평택 산업단지",
    description: "평택 산업단지 분석",
    center: [37.034727800726856, 127.06008195877075],
    lastUpdateDate: new Date("2026-12-17T03:24:00"),
  },
  ulsan: {
    name: "울산 산업단지",
    description: "울산 산업단지 분석",
    center: [35.5055, 129.3836],
    lastUpdateDate: new Date("2024-12-17T03:24:00"),
  },
  yeosu: {
    name: "여수 산업단지",
    description: "여수 산업단지 분석",
    center: [34.825815181845634, 127.67766559858815],
    lastUpdateDate: new Date("2023-12-17T03:24:00"),
  },
};

export const AREA_ARRAY: AreaKey[] = ["pyeongtaek", "ulsan", "yeosu"];
