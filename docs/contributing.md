# Contributing

코드 구조·작성 규칙. 결정 근거는 `decisions.md`.

## 디렉토리 구조

```
src/
├─ sidepanel/           # 메인 UI (React 앱, D10)
│   ├─ index.html
│   ├─ main.tsx
│   ├─ App.tsx           #   [탭]/[라이브러리] 최상위 토글
│   └─ components/
│       ├─ tabs/        #   라이브 탭 뷰: 그룹핑 토글, 탭 카드, 가져오기
│       └─ library/     #   라이브러리 뷰: group/tag/note, tag 필터
│
├─ store/               # Zustand store (D21) — groups/tags/notes + 액션
│
├─ lib/                 # 공유 로직
│   ├─ storage.ts       #   chrome.storage.local 접근 (D7)
│   ├─ ids.ts           #   crypto.randomUUID 래퍼 (D13)
│   └─ tabs.ts          #   chrome.tabs 조회 + 그룹핑(윈도우/도메인/시간대 버킷 D23)
│
├─ types/               # 엔티티 타입 (group/tag/note/noteBody)
│
├─ extension_context/
│   ├─ service_worker/  # Service Worker (D24) — 아이콘 클릭 → 패널 열기만
│   └─ content_script/  # 미사용 (D25). 추후 활용 대비 git keep
│
└─ manifest.config.ts   # CRXJS manifest 정의
```

## 코드 규칙

### 단순함 우선

-   요청된 것만 구현. 추측성 기능·추상화 금지.
-   단일 사용처 코드에 추상화 만들지 않음.
-   senior engineer가 "과하다"고 할 코드면 다시 단순화.

### 데이터 흐름

-   storage 접근은 `lib/storage.ts`를 통해서만. 키 규칙을 한 곳에 집중.
-   storage 읽기/쓰기는 Zustand store 액션에 캡슐화. 컴포넌트는 store 액션을 호출하고 필요한 슬라이스만 구독 (D21).
-   메타와 body를 섞지 않음. body는 항상 lazy 경로로 (D5).
-   라이브 탭은 저장 모델에 넣지 않음 (D19). `chrome.tabs.query()` 결과는 컴포넌트 지역 상태로 다루고, "가져오기" 시에만 note로 변환해 store에 넘김.
-   시간대 버킷 경계값 등 그룹핑 상수는 `lib/tabs.ts` 한 곳에 (D23).

### SW 경계

-   SW(`background/`)는 패널을 여는 역할만 (D24). storage·데이터 가공을 SW에 넣지 않음. `lib/storage.ts`를 SW가 import하지 않음.

### 타입

-   엔티티 타입은 `types/`에 단일 정의. 중복 선언 금지.
-   라이브 탭은 `chrome.tabs.Tab`을 그대로 사용. 별도 저장 타입을 만들지 않음 (D19).
-   미래 확장 필드(body `format` 등)는 타입에 미리 반영하되 MVP 값만 구현.

### 변경 범위

-   건드린 라인은 요청에 직접 추적되어야 함.
-   인접 코드 "개선"·무관한 리팩터 금지.
-   기존 스타일에 맞춤.

## 문서 동기화

-   설계 결정이 바뀌면 `decisions.md` 먼저 갱신 → 코드 반영.
-   기능 범위 변경은 `features.md`에 반영.
-   미해결 항목이 해소되면 해당 문서의 "미해결" 섹션에서 제거하고 본문으로 승격.
