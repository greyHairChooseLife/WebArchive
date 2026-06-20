# Runbook

개발·빌드·로드 절차. 스택은 React + Vite + CRXJS, Chrome MV3. 패키지매니저 npm, 포맷 Biome (D21, D22).

> 아직 프로젝트 스캐폴딩이 생성되지 않았다. 아래는 확정 스택 기준의 예정 절차이며,
> 실제 스크립트 이름·빌드 산출 디렉토리는 셋업 후 확정한다. 미정 항목은 하단에 표시.

## 사전 요구

-   Node (LTS)
-   Chrome (MV3 / Side Panel 지원 버전)

## 설치

```
npm install
```

## 개발 (HMR)

```
npm run dev
```

-   CRXJS가 manifest·HMR·빌드를 처리.
-   `dist/`(또는 빌드 산출 디렉토리)가 watch 모드로 생성됨.

## 빌드

```
npm run build
```

-   배포용 산출물 생성.

## 포맷

```
npx biome format --write .
```

-   포맷터는 Biome. 린트·테스트는 MVP 미사용 (D22).

## Chrome에 로드

1.  `chrome://extensions` 접속
2.  우상단 "개발자 모드" 켜기
3.  "압축해제된 확장 프로그램을 로드합니다" → 빌드 산출 디렉토리 선택
4.  Side Panel 열기: 확장 아이콘 왼쪽클릭 (SW가 `chrome.action.onClicked`로 패널을 엶, D24)

## 데이터 백업 / 복원

-   export: 설정에서 JSON 내보내기
-   import: 설정에서 JSON 가져오기
-   (구현 시 절차 보강)

## 미해결 / 명확화 필요

-   **스크립트 이름**: dev/build/format 등 정확한 npm script 미정 (셋업 시 package.json 확정).
-   **빌드 산출 디렉토리**: CRXJS 기본값 확인 필요.
