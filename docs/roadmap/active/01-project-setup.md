# 01. 프로젝트 셋업

상태: 진행 중

## 범위

-   Vite + React + CRXJS + TypeScript 스캐폴딩
-   npm, Biome(포맷터만)
-   `manifest.config.ts` (D11, D24, D25)
-   `contributing.md` 디렉토리 구조로 배치
-   SW 최소 코드 포함: `chrome.action.onClicked` + `setPanelBehavior` (D24)

## 검증

-   `npm run dev` 실행 → 빌드 산출물을 Chrome에 로드 → 아이콘 클릭 시 빈 Side Panel이 뜬다

## 작업 목록

-   [ ] Vite react-ts 템플릿으로 스캐폴딩
-   [ ] `@crxjs/vite-plugin` 설치 + `vite.config.ts` 등록
-   [ ] `manifest.config.ts` 작성 (permissions: tabs, storage / side_panel / background)
-   [ ] `contributing.md` 구조로 디렉토리 재배치 (`src/sidepanel`, `src/extension_context/{service_worker,content_script}`, `src/lib`, `src/store`, `src/types`)
-   [ ] SW 최소 코드 작성
-   [ ] Vite 데모 콘텐츠 정리
-   [ ] Biome 설치 + 설정 (포맷터만)
-   [ ] package.json scripts 확정 (dev/build/format)
-   [ ] `npm run dev` → Chrome 로드 → 빈 패널 확인
-   [ ] runbook.md 미해결 섹션 갱신

## 진행 기록

-   계획 수립 완료.
