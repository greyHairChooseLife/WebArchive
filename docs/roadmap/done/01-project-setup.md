# 01. 프로젝트 셋업

상태: 완료

## 범위

-   Vite + React + CRXJS + TypeScript 스캐폴딩
-   npm, Biome(포맷터만)
-   `manifest.config.ts` (D11, D24, D25)
-   `contributing.md` 디렉토리 구조로 배치
-   SW 최소 코드 포함: `setPanelBehavior` (D24)

## 검증

-   `npm run dev` 실행 → 빌드 산출물을 Chrome에 로드 → 아이콘 클릭 시 빈 Side Panel이 뜬다

## 작업 목록

-   [x] Vite react-ts 템플릿으로 스캐폴딩
-   [x] `@crxjs/vite-plugin` 설치 + `vite.config.ts` 등록
-   [x] `manifest.config.ts` 작성 (permissions: tabs, storage, sidePanel / side_panel / background)
-   [x] `contributing.md` 구조로 디렉토리 재배치 (`src/sidepanel`, `src/extension_context/{service_worker,content_script}`, `src/lib`, `src/store`, `src/types`)
-   [x] SW 최소 코드 작성
-   [x] Vite 데모 콘텐츠 정리
-   [x] Biome 설치 + 설정 (포맷터만)
-   [x] package.json scripts 확정 (dev/build/format)
-   [x] `npm run dev` → Chrome 로드 → 빈 패널 확인
-   [x] runbook.md 미해결 섹션 갱신

## 진행 기록

-   계획 수립 완료.
-   스캐폴딩, eslint 제거(D22), 디렉토리 재배치, manifest/vite config, SW 코드, Biome 설정까지 완료.
-   검증 중 SW 등록 실패 발생 → 원인 2가지 확인 후 수정:
    -   Vite 8 `server.cors` 기본값이 `chrome-extension://` origin을 막아 SW의 모듈 fetch가 CORS로 차단됨 → `vite.config.ts`에 `server.cors: true` 추가.
    -   `chrome.sidePanel` API는 `side_panel` manifest 키만으로는 노출되지 않고 `permissions`에 `sidePanel` 명시가 필요함 → 추가.
-   재검증 통과: 확장 아이콘 클릭 시 빈 Side Panel이 뜸.
