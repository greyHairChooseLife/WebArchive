# 02. 타입 + storage 토대

상태: 완료

## 범위

-   엔티티 타입 정의 (`types/`)
-   `lib/storage.ts`: chrome.storage.local 접근 (D7)
-   `lib/ids.ts`: `crypto.randomUUID()` 래퍼 (D13)
-   Zustand store 골격: add + load 액션만 (D21)

## 결정 확정 (이번 단계에서 새로 정함)

-   **쓰기 전략**: 전체 덤프. groups/tags/notes/noteBodies 각각 배열(또는 record)을 컬렉션 단위 키 하나로 통째 저장. 변경 시 해당 컬렉션 전체를 다시 씀.
-   **storage 키 분리**: 메타와 body는 별도 키.
    -   `groups`: `Group[]`
    -   `tags`: `Tag[]`
    -   `notes`: `Note[]` (메타만, D17 5필드 + groupId + tagIds)
    -   `noteBodies`: `Record<string, NoteBody>` (id → body, lazy 접근용)
-   **store 범위**: add/load만. update/delete/cascade(D26)는 3단계(라이브러리 뷰)에서 실제 UI와 함께 구현.

이 결정들은 architecture.md의 "미해결" 항목(스토리지 쓰기 전략) 중 일부를 해소함 → 구현 후 architecture.md 갱신 필요.

## 작업 목록

-   [x] `src/types/`: `Group`, `Tag`, `Note`(메타), `NoteBody` 타입 정의 (architecture.md 데이터 모델 그대로) → `src/types/entities.ts`
-   [x] `src/lib/ids.ts`: `generateId()` = `crypto.randomUUID()` 래퍼
-   [x] `src/lib/storage.ts`:
    -   키 상수 정의 (`groups`, `tags`, `notes`, `noteBodies`)
    -   `getGroups/setGroups`, `getTags/setTags`, `getNotes/setNotes`, `getNoteBody(id)/setNoteBody(id, body)` 형태의 함수
    -   내부적으로 `chrome.storage.local.get/set` 사용
-   [x] `src/store/`: Zustand store 골격 → `src/store/useLibraryStore.ts` (immer 미들웨어)
    -   상태: `groups`, `tags`, `notes` (body는 store에 안 둠, 필요 시 컴포넌트가 storage.ts 직접 호출)
    -   액션: `loadAll()` (storage → store 채움), `addGroup`, `addTag`, `addNote` (store + storage 동시 반영)
-   [x] 임시 검증: App.tsx에서 `addNote` 호출 → 새로고침 → `loadAll` 결과로 복원되는지 확인 (UI는 임시/최소, 3단계에서 교체됨)
-   [x] architecture.md "미해결 → 스토리지 쓰기 전략" 항목 해소 반영

## 검증

-   add로 store/storage에 엔티티가 생기고, 새로고침(패널 재오픈) 후 storage에서 복원되어 store에 다시 채워진다.

## 진행 기록

-   계획 수립 완료.
-   타입(`types/entities.ts`), `lib/ids.ts`, `lib/storage.ts`, `store/useLibraryStore.ts`(immer 미들웨어) 구현 완료.
-   App.tsx에 임시 검증 UI 추가, 수동 확인(추가 → 새로고침 → 복원) 통과.
-   architecture.md 스토리지 섹션과 "미해결" 목록 갱신 완료. 단계 종료.
