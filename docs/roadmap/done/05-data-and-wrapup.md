# 05. 데이터 관리 + 마무리

상태: 완료

## 범위

-   JSON export / import (통째 교체, D14)
-   최상단에 "설정" 탭 추가 ([탭]/[라이브러리]/[설정] 3-way 토글)
-   SW로 아이콘 클릭 → 패널 열기 연결 — **1단계에서 이미 구현 완료**(`setPanelBehavior`), 이번 단계는 검증만

## 결정 참조

-   features.md 6번(데이터 관리)
-   D14 (로컬 전용 + JSON export/import, import는 전체 교체)
-   D24 (SW는 패널 열기 전용) — 구현은 1단계, 재확인만

## 확정 사항 (이번 단계에서 새로 정함)

-   export/import UI는 새 "설정" 탭에 배치. `App.tsx`의 view 타입을 `'tabs' | 'library' | 'settings'`로 확장.
-   import 전 네이티브 `confirm()`으로 "기존 데이터를 모두 지우고 파일 내용으로 교체합니다" 경고 → 확인 시에만 진행.
-   export 파일은 `groups` + `tags` + `notes` + `noteBodies` 전체 포함 (메타만이 아닌 진짜 백업).

## 작업 목록

### `lib/storage.ts` 또는 신규 `lib/backup.ts`

-   [x] `exportData()`: 4개 컬렉션을 한 번에 읽어 JSON 객체로 합치고 Blob/파일 다운로드 트리거
-   [x] `importData(json)`: JSON 파싱 → 4개 컬렉션 전체를 `setGroups`/`setTags`/`setNotes`/`setNoteBodies`(또는 storage.local.set 직접)로 통째 교체
    -   `noteBodies` record 전체를 한 번에 쓰는 함수가 없다면 `lib/storage.ts`에 `setNoteBodies(record)` 추가
-   [x] import 후 `useLibraryStore.loadAll()` 재호출로 store 동기화

### UI: `src/sidepanel/components/settings/`

-   [x] `SettingsView.tsx`: export 버튼(클릭 시 JSON 파일 다운로드), import 버튼(파일 input → confirm → importData → loadAll)
-   [x] `App.tsx`: 최상단 nav에 "설정" 버튼 추가, view 타입 확장, `view === 'settings'`일 때 `SettingsView` 렌더

### 마무리 점검

-   [x] SW 아이콘 클릭 → 패널 열기 재확인 (회귀 없는지)
-   [x] roadmap.md 5단계 상태 `완료`로 변경 + 문서 `done/`으로 이동 (마지막 단계이므로 MVP 전체 완료 처리)

## 검증

-   [x] export 클릭 → JSON 파일 다운로드, 파일 안에 groups/tags/notes/noteBodies 모두 포함 확인
-   [x] 다른 데이터로 만든 후 import 클릭 → confirm 경고 → 확인 → 기존 데이터 전부 사라지고 파일 내용으로 교체, 라이브러리 뷰에 즉시 반영
-   [x] 확장 아이콘 클릭 → Side Panel 정상 오픈 (1단계 회귀 확인)

## 진행 기록

-   계획 수립 완료.
-   구현 완료. `lib/storage.ts`에 `getNoteBodies`/`setNoteBodies` 추가, `lib/backup.ts`(exportData/importData), `components/settings/SettingsView`, `App.tsx`에 설정 탭 연결. 사용자 직접 테스트로 동작 확인 — MVP 전체 완료.
