# Decisions

확정된 설계 결정 기록. 각 결정은 "결정 / 이유 / 대안" 형식.

## 데이터 모델

### D1. 계층은 group → tag → note, note는 group 소유

-   결정: note의 1차 소속은 group. tag는 note에 붙는 라벨.
-   데이터는 평평하게 저장하고 계층은 UI에서 표현.
-   이유: "그룹 내 다대다 tag", "tag 없는 note" 모두 자연스럽게 표현됨.
-   대안: tag가 note를 소유하는 문자 그대로의 트리 → 다대다·tag 없는 note 처리가 어려워 기각.
-   note는 항상 실제 group을 가짐. 미분류 상태나 예약 group("inbox")은 없음 (D20).

### D2. note ↔ tag 는 다대다

-   결정: note 하나가 여러 tag에 동시 소속 가능.
-   이유: 기존 북마크(폴더 트리)의 "한 곳에만 넣을 수 있음" 한계를 해소하는 것이 목적.

### D3. tag는 전역 (group과 독립)

-   결정: tag는 group에 종속되지 않고 전역 pool로 존재. 어느 group의 note든 같은 tag 공유 가능.
-   이유: 크로스-group 분류·검색이 가능. tag 재사용성이 높음.
-   tradeoff: tag 수가 늘면 관리 부담. group과 무관하게 tag가 한 곳에 모임.

### D4. note는 독립 레코드, URL 중복 제약 없음

-   결정: 같은 URL을 어느 group/tag에든 중복 저장 가능. 각 note는 독립 레코드.
-   group 내 URL 유니크 제약도 없음 (논의 중 철회됨).
-   이유: 단순함. 다대다는 note↔tag에서 이미 처리됨.
-   확장: 탭 가져오기(D19)에서도 URL 중복 검사 없음. 라이브 탭은 브라우저의 현재 상태를 있는 그대로 반영하는 것이 옳음. 비슷한 note가 쌓이는 중복 정리는 나중 최적화 (D18).

### D5. note 메타 / body 분리

-   결정: note를 가벼운 메타와 무거운 body 두 레코드로 분리.
    -   메타: 트리·목록 렌더용. 항상 로드.
    -   body: 상세 열 때 lazy load.
-   이유: 미래에 body가 리치 문서(텍스트+이미지 인라인, Notion식 블록)로 커져도 메타 로딩이 망가지지 않도록.
-   body는 `format` 필드로 진화: 지금 `'plain'`, 미래 `'blocks'`.

## 스토리지

### D7. chrome.storage.local 사용

-   결정: 데이터 영속화는 `chrome.storage.local`.
-   이유: 의존성 0, 북마크 데이터는 작음(수천 개라도 수 MB). IndexedDB는 MVP에 과함.
-   한계: 용량 ~10MB. note 약 1만 개 근처가 한계.
-   대안: IndexedDB(Dexie) → 데이터가 한계에 가까워지면 그때 마이그레이션.

## UI / 빌드

### D10. UI는 Side Panel 단독

-   결정: native Side Panel만 사용. Popup·Full page·New Tab override 안 씀.
-   이유: 사용자가 명시적으로 Side Panel 단독 선택.
-   향후: 필요 시 다른 진입점 추가 가능.

### D11. React + Vite + CRXJS, Chrome MV3

-   결정: UI 프레임워크 React, 빌드 Vite + CRXJS 플러그인. 대상은 Chrome, Manifest V3.
-   이유: group/tag/note 트리 + 다대다 tag + 라이브 탭 뷰는 상태가 복잡 → React. CRXJS가 manifest/HMR/빌드 자동 처리.
-   대안: Firefox 크로스 → webextension-polyfill 필요, 나중.

### D13. ID는 crypto.randomUUID()

-   결정: 모든 엔티티 id는 `crypto.randomUUID()`.
-   이유: 브라우저 내장, 충돌 없음.

### D21. 언어 TypeScript, 상태관리 Zustand, 스타일 CSS Modules

-   결정:
    -   언어 = TypeScript. 엔티티 타입(group/tag/note) 안정성.
    -   상태관리 = Zustand. 저장 상태(groups/tags/notes)를 여러 화면이 공유 → 전역 store가 자연스러움. storage 동기화를 store 액션에 캡슐화. 라이브 탭처럼 지역적인 상태는 컴포넌트 `useState`.
    -   스타일 = CSS Modules. 의존성 최소, 좁은 Side Panel UI엔 충분.
-   대안: 상태관리 Context+useReducer → 같은 일을 보일러플레이트 더 많이. Tailwind → CRXJS+Vite에 PostCSS 설정 추가 부담.

### D22. 패키지매니저 npm, 포맷 Biome, lint·test 미사용

-   결정: 패키지매니저 = npm. 포맷터 = Biome. 린트·테스트는 MVP에서 미사용(해커톤 속도 우선).
-   이유: 추가 의존성·룰 다툼 최소화. 핵심 로직(그룹핑·시간대 버킷)이 안정되면 테스트 추가 검토.

## 동기화

### D14. 로컬 전용 + JSON export/import (import = 통째 교체)

-   결정: 자동 동기화 없음. 설정에서 수동 export/import만.
-   import는 **전체 데이터를 파일로 통째 교체**(restore). 기존 groups/tags/notes/bodies를 비우고 파일 내용으로 대체. 부분 병합·id 단위 머지 없음.
-   이유: 자동 동기화는 백엔드·인증을 들이는 순간 프로젝트 성격이 바뀜. export/import는 거의 공짜고 백업 니즈 해결. 통째 교체는 병합 충돌 정책을 고민할 필요가 없어 가장 단순하고 "백업 복원" 의미와 일치.
-   대안: 클라우드 동기화 / chrome.storage.sync(용량 부족) → 나중. id 단위 머지 → 충돌 정책 복잡, 기각.

## note 필드 (MVP)

### D17. note 메타는 5개 필드

-   결정: note 메타 필드 = url, title, favicon, createdAt, updatedAt.
    -   url: `tab.url`
    -   title: `tab.title`
    -   favicon: `tab.favIconUrl`
    -   createdAt / updatedAt: 자동 기록
-   memo는 메타에 포함하지 않고 body(plain text)에 저장 (D5와 일치).
-   라이브 탭의 런타임 정보(`lastAccessed`, `windowId`)는 note에 저장하지 않음 (D23).

## 라이브 탭 / 탭 가져오기

### D18. URL 매칭·중복 검사는 MVP 비범위

-   결정: 탭 뷰·가져오기·라이브러리 어디에서도 URL 정규화·중복 검사를 하지 않음.
-   이유: 탭 뷰는 브라우저의 현재 상태를 있는 그대로 보여주는 것이 옳음 — 같은 URL 탭 3개가 열려 있으면 3개 다 표시. 사용자가 인식하는 현실과 일치. grouped/tagged 이후 URL 기반 중복 판정도 실익이 적음.
-   영향: presence 표시(탭↔note 매칭)도 같은 토대가 없어 MVP에서 제외 → 나중.
-   대안: 가벼운/공격적 URL 정규화 → 비슷한 note가 쌓일 때 나중 최적화로.

### D19. 라이브 탭은 저장 대상이 아니라 조회 대상

-   결정: 브라우저에 열린 탭은 `chrome.tabs.query()`로 그릴 뿐, 저장하지 않음. "가져오기"를 누르는 순간 비로소 note로 변환·저장된다.
-   이유: 탭 매니저(1차 진입점)와 아카이브(라이브러리)를 분리. 탭 카드는 닫히면 사라지는 라이브 표현, note는 영속 레코드.
-   탭 ─[가져오기]→ note 로 단방향 변환.

### D20. inbox 없음, 가져올 때 group 필수 지정

-   결정: "일단 임시 보관" 개념(inbox)을 두지 않음. 라이브 탭에서 "가져오기" 시 대상 group을 반드시 지정(기존 group 선택 또는 새 group 생성). tag는 사후.
-   이유: 미분류 임시 대기소를 거치지 않고, 고르는 순간 목적지를 정하면 D1("note는 group 소유")이 순수하게 유지됨. `groupId` nullable·예약 group 같은 특수 케이스가 코드 전체에 퍼지지 않음.
-   대안: inbox 예약 group / `groupId` nullable → 미분류 상태 분기가 늘어 기각.

### D23. 시간대 그룹핑은 lastAccessed 기반, 런타임 정보는 저장 안 함

-   결정: 라이브 탭 "시간대별 보기"의 기준은 `tab.lastAccessed`(마지막으로 활성화된 시각). note 저장 시 `lastAccessed`·`windowId` 등 런타임 값은 버림.
-   이유: Chrome은 "탭이 열린 시각"을 주지 않음. `onCreated`를 SW로 추적하면 정확하지만 MV3 SW 생명주기·확장 설치 전 탭 누락 문제가 큼. 사용자가 실제 원하는 "방치된 탭 찾기"는 "마지막 본 지 오래됨"(`lastAccessed`)이 더 정확한 신호. SW 없이 API만으로 즉시 가능.
-   라이브 관점(시간대/윈도우)은 라이브 탭의 속성이지 note의 속성이 아님. 저장된 windowId는 100% 무의미(윈도우 닫히면 id 재사용).
-   시간대 버킷(상호배타, 빈 구간 숨김):
    -   최근: 5분 이내
    -   1시간 이내: 5분 ~ 1시간
    -   오늘: 1시간 ~ 24시간
    -   며칠 전: 1 ~ 7일
    -   오래됨: 7일 이상
-   경계 상수는 코드 한 곳에 모아 조정 쉽게.

## Service Worker / Content Script

### D24. SW 1개, 역할은 "아이콘 클릭 → 패널 열기"로만 한정

-   결정: Side Panel은 manifest의 `side_panel` 선언만으로 등록되며 SW 없이도 열린다. 다만 아이콘 왼쪽클릭 한 번에 패널을 여는 편의를 위해 SW 1개를 둔다. SW는 `setPanelBehavior({ openPanelOnActionClick: true })`만 담당.
-   `chrome.sidePanel` API(`setPanelBehavior` 포함) 사용에는 manifest `permissions`에 `sidePanel` 명시가 필요. `side_panel` 키만으로는 API가 노출되지 않음.
-   위치: `src/extension_context/service_worker/`.
-   이유: 탭 매니저가 1차 진입점이라 아이콘 클릭 진입 마찰을 없애는 게 중요. 데이터·storage 로직은 전부 패널이 직접 처리 → "SW↔패널 책임 분담" 복잡도가 생기지 않음.
-   단축키·컨텍스트 메뉴는 나중(SW 역할 확장 시).

### D25. content script MVP 미사용

-   결정: content script 로직을 두지 않음. note 메타 5필드는 `chrome.tabs` API(`tab.title`, `tab.favIconUrl`, `tab.url`)만으로 충족. 디렉토리(`src/extension_context/content_script/`)는 추후 활용 대비 git keep으로 자리만 둔다.
-   이유: DOM 직접 접근이 필요한 건 og:image·본문 발췌·전체 캡처 등 "나중" 기능뿐. 지금 코드를 넣으면 하는 일 없이 `<all_urls>` 권한만 늘어 설치 경고가 강해짐(contributing.md "추측성 금지").
-   권한은 `tabs`만 선언(`host_permissions: <all_urls>` 안 붙임).

## 삭제 / cascade

### D26. group 삭제 = 하위 note 통째 삭제, tag 삭제 = 라벨만 제거

-   결정:
    -   group 삭제: 확인 모달("note N개 삭제됨") 후 하위 note까지 통째 삭제. inbox 같은 자동 대피소가 없으므로(D20) "어디로 옮길지" 문제를 만들지 않고 명확히 삭제.
    -   tag 삭제: note의 `tagIds`에서 해당 id만 제거, note는 유지. tag는 note를 소유하지 않는 라벨(D1).
-   note는 독립 레코드(D4)라 group cascade 삭제가 깔끔.
