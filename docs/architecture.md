# Architecture

북마크 대체 + 탭 매니저 브라우저 확장의 기술 아키텍처. 결정 근거는 `decisions.md` 참조.

## 전체 구조 (Chrome MV3)

확장은 두 실행 컨텍스트로 구성된다.

### Side Panel (메인 UI, React 앱)

-   모든 애플리케이션 로직이 여기 있다.
-   `chrome.tabs` / `chrome.windows` / `chrome.storage`를 직접 호출.
-   group/tag/note 관리(라이브러리 뷰)와 라이브 탭 뷰를 담당.

### Service Worker (D24)

-   위치: `src/extension_context/service_worker/`.
-   역할은 "패널 여는 스위치" 하나로 한정.
-   `chrome.action.onClicked` → 패널 열기, `setPanelBehavior` 호출만.
-   데이터 로직·storage 접근 없음.

### 미사용 컨텍스트

-   Content Script — 미사용 (D25).
-   Popup — 미사용 (D10).

### 영속 데이터

-   `chrome.storage.local`에 저장 (D7). Side Panel만 읽고 쓴다.

### 컨텍스트 간 경계

-   SW는 패널을 여는 역할만 한다. storage 쓰기·데이터 가공은 전부 Side Panel이 직접 (D24).
-   SW↔패널 메시지 프로토콜은 없음 (서로 데이터를 주고받지 않음).

## 두 개의 최상위 화면

Side Panel 최상단 토글로 전환. 한 번에 하나만 표시.

```
┌─ Side Panel ──────────────┐
│ [탭]  [라이브러리]          │  ← 최상위 토글
├───────────────────────────┤
│  탭 뷰 (라이브, 저장 안 됨)  │   또는   라이브러리 뷰 (저장됨)
└───────────────────────────┘
```

-   **탭 뷰** = 지금 열린 라이브 탭. `chrome.tabs.query()` 결과를 그릴 뿐 저장 안 함 (D19).
-   **라이브러리 뷰** = `chrome.storage.local`에 저장된 group/tag/note.
-   탭 ─[가져오기]→ note 로 단방향 변환 (D19, D20).

## 데이터 모델

### 엔티티 (저장됨)

```
group {
  id: string            // crypto.randomUUID()
  name: string
}

tag {                   // 전역 (group과 독립)
  id: string
  name: string
}

note (meta) {
  id: string
  groupId: string       // note는 항상 실제 group 소유 (미분류 없음, D20)
  url: string
  title: string
  favicon: string       // tab.favIconUrl
  tagIds: string[]      // 다대다, 전역 tag 참조
  createdAt: number
  updatedAt: number
}

noteBody {
  id: string            // note.id와 동일
  format: 'plain'       // 미래: 'blocks'
  content: string       // 지금: plain text memo
                        // 미래: Notion식 블록 배열
}
```

### 라이브 탭 (저장 안 됨, 런타임 전용)

`chrome.tabs.query()`가 돌려주는 `Tab`을 그대로 사용. 저장 모델에 들어가지 않음 (D19, D23).

-   사용 필드: `id`, `url`, `title`, `favIconUrl`, `windowId`, `lastAccessed`
-   `windowId` → 윈도우별 그룹핑
-   도메인(`new URL(url).hostname`) → 도메인별 그룹핑
-   `lastAccessed` → 시간대별 그룹핑(D23 버킷)

### 관계 요약

-   group 1 — N note. 모든 note는 실제 group을 가짐 (미분류·inbox 없음, D20).
-   tag는 전역 pool. note N — N tag (group 경계 없음).
-   note 1 — 1 noteBody (lazy).
-   tag 없는 note 허용. URL 중복 제약 없음 (D4, D18).

## 상태 관리 (D21)

-   **Zustand store**: 저장 상태(groups/tags/notes)와 액션(addNote, deleteGroup, removeTag 등). storage 읽기/쓰기를 액션 안에 캡슐화 → 컴포넌트는 필요한 슬라이스만 구독. 구현: `src/store/useLibraryStore.ts` (immer 미들웨어로 불변 업데이트). `loadAll`/`add`·`update`·`delete`(group/tag/note 전부) 구현 완료. `deleteGroup`은 하위 note·body까지 cascade(D26), `deleteTag`는 note의 `tagIds`에서만 제거.
-   **컴포넌트 useState**: 라이브 탭 목록, 그룹핑 토글, 체크박스 선택, 화면 토글 등 지역 UI 상태.
-   storage 접근은 store 액션 → `lib/storage.ts` 경유. 키 규칙은 한 곳에.

## 스토리지 (chrome.storage.local)

-   데이터 영속화는 `chrome.storage.local` (D7).
-   note 메타와 body를 분리 저장. body는 상세 열 때 lazy load (D5).
-   **쓰기 전략**: 전체 덤프. `groups`/`tags`/`notes`/`noteBodies` 각각 컬렉션 단위 키 하나로 통째 저장하고, 변경 시 해당 컬렉션 전체를 다시 씀.
-   **키 레이아웃**:
    -   `groups`: `Group[]`
    -   `tags`: `Tag[]`
    -   `notes`: `Note[]` (메타만)
    -   `noteBodies`: `Record<string, NoteBody>` (id → body, lazy 접근용)
-   구현: `src/lib/storage.ts`. `getGroups/setGroups`, `getTags/setTags`, `getNotes/setNotes`, `getNoteBody(id)/setNoteBody(id, body)` 형태로 키 접근을 캡슐화.
-   body 캐시 정책은 여전히 미확정 (아래 미해결 참조).

## 정보 수집 (MVP)

탭에서 `chrome.tabs` API로 직접 수집. content script 불필요 (D25).

| 필드 | 출처 |
|-----|-----|
| url | `tab.url` |
| title | `tab.title` (Chrome이 `<title>` 파싱해 채움) |
| favicon | `tab.favIconUrl` (Chrome이 채움) |
| createdAt / updatedAt | `Date.now()` (저장 시각) |

-   런타임 값(`lastAccessed`, `windowId`)은 note에 저장하지 않음 (D23).
-   og:image·본문 추출은 content script가 필요 → 나중(리치 클립 단계).

## 성능 특성

-   메타 전체 로드: note 1만 개라도 ~40ms 수준. 사용자 체감 거의 없음.
-   탭 뷰: `chrome.tabs.query()` 결과를 그룹핑 키로 묶어 렌더. 탭 수는 보통 수십~수백 → 가벼움.
-   라이브러리 렌더: 현재 보는 group/tag의 note만 표시 → 적음. 많으면 가상 스크롤 도입 검토.
-   한계선: note 약 1만 개(~10MB) 근처에서 IndexedDB 마이그레이션 검토.

## 미해결 / 명확화 필요

-   **body 캐시 정책**: lazy load 시 캐시 상한·방출(LRU 등) 미정.
-   **마이그레이션 경로**: 스키마 버전 관리·IndexedDB 전환 절차 미정.

## 해소된 미해결 항목

-   **탭 뷰 갱신 방식** (해소): 패널 진입/탭뷰 전환 시 1회성 `chrome.tabs.query()`만 호출. `onUpdated`/`onRemoved` 구독 없음(D22 단순함 우선). 구현: `src/lib/tabs.ts`의 `queryAllTabs()`, 호출부는 `TabsView` 마운트 시 1회.
