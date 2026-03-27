# Geo Stellar Portal

위성 데이터를 활용해 관심 지역의 변화를 분석하는 **지리공간 데이터 분석 플랫폼**입니다.  
사용자가 지도에서 직접 관심 영역(ROI)을 선택하고, NDVI 시계열 변화 및 SAR 기반 분석 결과를 확인하는
흐름을 중심으로 설계했습니다.

## 프로젝트 배경

일반적인 지도 서비스는 데이터를 보여주는 데 그치지만, 실제 위성 데이터 SaaS 서비스는 **사용자가 분석
영역을 직접 설정하고 결과를 확인하는 인터랙티브한 흐름**이 필요합니다. 이 플로우를 프론트엔드
관점에서 설계하고 구현하는 데 집중했습니다.

## 주요 구현 사항

### 1. 지도 기반 관심 영역(ROI) 선택 및 면적 계산

사각형과 다각형 두 가지 방식으로 분석 영역을 선택할 수 있습니다.

**지리 계산의 정확성 문제를 해결했습니다.**  
단순 위경도 차이로 면적을 계산하면 위도에 따라 경도 1도의 실제 거리가 달라지는 문제가 발생합니다.

- 사각형: 위도 보정 계수(`cos(midLat)`)를 적용한 면적 계산
- 다각형: `@turf/turf` 라이브러리로 구면 기하 기반의 정확한 면적 계산 적용
- 폴리곤 닫기(첫 점 = 끝 점) 처리를 내부에서 자동으로 수행해 외부에서 신경 쓰지 않아도 되도록 설계

```ts
// 폴리곤 면적 계산 — turf 기반 구면 기하 적용
const poly = polygon([coords]); // 닫기 처리 포함
const areaInM2 = area(poly);
return Number((areaInM2 / 1_000_000).toFixed(2)); // km²
```

### 2. Zustand subscribeWithSelector 패턴으로 파생 상태 자동 동기화

선택 지역(`selectedArea`)이 바뀔 때 지도 중심 좌표(`position`)가 자동으로 변경되어야 합니다.  
이를 위해 `subscribeWithSelector` 미들웨어로 상태 변화를 구독하고, 파생 상태를 스토어 레벨에서 자동
동기화했습니다.  
컴포넌트가 두 상태를 각각 구독하거나 `useEffect`로 동기화할 필요가 없습니다.

```ts
useAnalysisStore.subscribe(
  (store) => store.selectedArea,
  (newArea) => {
    useAnalysisStore.setState({ position: AREAS[newArea].center });
  }
);
```

### 3. 커스텀 드로우 툴바 및 영역 상태 초기화 연동

leaflet-draw의 기본 툴바 대신 직접 구현한 커스텀 툴바를 사용했습니다.  
지역이 변경되면 기존에 그려진 도형과 bbox 상태를 동시에 초기화하는 로직을 `useEffect`와 스토어
액션으로 연동했습니다.

### 4. 분석 주문 모달 — 4단계 상태 머신

confirm → loading → success → error 4단계를 `ModalStep` 유니온 타입으로 관리합니다.  
주문 성공 시 3초 카운트다운과 프로그레스 바를 표시하고 결과 페이지로 자동 이동하며,  
`clearInterval`로 메모리 누수를 방지했습니다.

```ts
type ModalStep = 'confirm' | 'loading' | 'success' | 'error';
```

### 5. 커스텀 셀렉터 훅 분리

스토어에서 컴포넌트가 필요한 값만 구독하도록 셀렉터 훅을 별도로 export했습니다.  
컴포넌트가 스토어 구조에 직접 의존하지 않아 스토어 내부 변경 시 영향 범위를 최소화할 수 있습니다.

```ts
export const useSelectedArea = () => useAnalysisStore((state) => state.selectedArea);
export const useLandArea = () => useAnalysisStore((state) => state.landArea);
```

## 기술 스택

| 분류      | 기술                                 |
| --------- | ------------------------------------ |
| Framework | Next.js (App Router), TypeScript     |
| 지도      | Leaflet, react-leaflet, leaflet-draw |
| 지리 계산 | @turf/turf                           |
| 상태 관리 | Zustand (subscribeWithSelector)      |
| 시각화    | Recharts                             |
| 스타일    | Tailwind CSS                         |

## 폴더 구조

```
src/
├── app/
│   ├── (header)/         # 헤더 포함 레이아웃 그룹
│   ├── (result)/         # 분석 결과 페이지
│   ├── components/       # 도메인/공통 UI 컴포넌트
│   │   └── ui/           # SelectBox, Radio 등 공통 UI
│   ├── store/            # Zustand 스토어 (analysisStore, modalStore)
│   └── api/              # Route Handler
├── types/                # TypeScript 인터페이스 정의
├── utils/                # geo.ts (면적 계산), polygonToBounds.ts
└── constants/            # areas.ts (지역 데이터)
```

## 개발하면서 고민한 것들

- **지리 계산의 함정**: 단순 위경도 차이로 면적을 계산하면 고위도일수록 오차가 커집니다. 위도 보정과
  turf.js를 선택적으로 적용해 정확도를 높였습니다.
- **leaflet-draw 타입 한계**: `L.Draw.Rectangle` 등 일부 API에 공식 타입 정의가 없어
  `(L as any).Draw`로 처리했습니다.
- **지역 변경 시 상태 초기화**: 지역이 바뀌면 이전에 그린 영역과 가격 정보가 남아있으면 안 됩니다.
  `subscribeWithSelector`로 지역 변경을 감지해 관련 상태를 한 곳에서 초기화했습니다.
