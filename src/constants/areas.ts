import { AreaKey } from '@/src/types/area';

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
    name: '평택 산업단지',
    description: '평택 산업단지 분석',
    center: [37.034727800726856, 127.06008195877075],
    lastUpdateDate: new Date('2026-12-17T03:24:00'),
  },
  ulsan: {
    name: '울산 산업단지',
    description: '울산 산업단지 분석',
    center: [35.5055, 129.3836],
    lastUpdateDate: new Date('2024-12-17T03:24:00'),
  },
  yeosu: {
    name: '여수 산업단지',
    description: '여수 산업단지 분석',
    center: [34.825815181845634, 127.67766559858815],
    lastUpdateDate: new Date('2023-12-17T03:24:00'),
  },

  gumi: {
    name: '구미 국가산업단지',
    description: '구미 국가산업단지 분석',
    center: [36.1215, 128.3816],
    lastUpdateDate: new Date('2024-11-15T03:24:00'),
  },
  changwon: {
    name: '창원 국가산업단지',
    description: '창원 국가산업단지 분석',
    center: [35.2272, 128.6811],
    lastUpdateDate: new Date('2024-10-10T03:24:00'),
  },
  pohang: {
    name: '포항 철강 산업단지',
    description: '포항 철강 산업단지 분석',
    center: [36.019, 129.3435],
    lastUpdateDate: new Date('2024-09-12T03:24:00'),
  },
  gwangyang: {
    name: '광양 제철 산업단지',
    description: '광양 제철 산업단지 분석',
    center: [34.9407, 127.6953],
    lastUpdateDate: new Date('2024-08-21T03:24:00'),
  },
  daesan: {
    name: '대산 석유화학단지',
    description: '대산 석유화학단지 분석',
    center: [36.9374, 126.4361],
    lastUpdateDate: new Date('2024-07-18T03:24:00'),
  },
};

export const AREA_ARRAY: AreaKey[] = [
  'pyeongtaek',
  'ulsan',
  'yeosu',
  'gumi',
  'changwon',
  'pohang',
  'gwangyang',
  'daesan',
];
