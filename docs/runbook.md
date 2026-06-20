# Runbook

개발·빌드·로드 절차. 스택은 React + Vite + CRXJS, Chrome MV3. 패키지매니저 npm, 포맷 Biome (D21, D22).

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
-   `dist/`가 watch 모드로 생성됨.
-   SW가 `chrome-extension://` origin에서 `localhost` 모듈을 fetch하므로 `vite.config.ts`의 `server.cors: true` 필요.

## 빌드

```
npm run build
```

-   배포용 산출물 생성.

## 포맷

```
npm run format
```

-   포맷터는 Biome. 린트·테스트는 MVP 미사용 (D22).

## Chrome에 로드

1.  `chrome://extensions` 접속
2.  우상단 "개발자 모드" 켜기
3.  "압축해제된 확장 프로그램을 로드합니다" → `dist/` 선택
4.  Side Panel 열기: 확장 아이콘 왼쪽클릭 (SW가 `setPanelBehavior`로 좌클릭 시 패널을 엶, D24)

## 데이터 백업 / 복원

-   export: 설정에서 JSON 내보내기
-   import: 설정에서 JSON 가져오기
-   (구현 시 절차 보강)

