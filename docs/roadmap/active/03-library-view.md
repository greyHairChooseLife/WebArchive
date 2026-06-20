# 03. 라이브러리 뷰

상태: 진행 중

## 범위

-   group/tag/note CRUD (add/update/delete 전부)
-   note 정렬: 최신 저장순(createdAt 내림차순) 고정
-   전역 tag 필터(+"현재 group 한정" 체크박스)
-   note 상세: memo(body) 조회·수정 UI (lazy load)
-   삭제 cascade: group 삭제 → 하위 note 통째 삭제(D26), tag 삭제 → note의 tagIds에서만 제거
-   App.tsx의 임시 검증 코드(테스트 note 추가 버튼 등) 제거하고 실제 라이브러리 뷰로 교체

## 결정 참조

-   features.md 3번(계층 관리), 5번(탐색/표시)
-   D26 (cascade 정책)
-   D5 (메타/body 분리, lazy load) — 2단계에서 만든 `getNoteBody`/`setNoteBody`를 이번에 실제로 사용

## 확정 사항 (이번 단계에서 새로 정함)

-   group/tag/note 세 엔티티 모두 add/update/delete 액션을 store에 구현.
-   note 상세 패널에서 제목·tagIds 수정 + memo(body) 조회·수정까지 포함.
-   group 삭제 cascade 확인은 네이티브 `confirm()` 사용 (커스텀 모달 없음, D22 단순함 우선).

## 작업 목록

### store (`useLibraryStore.ts`) 확장

-   [ ] `updateGroup`, `deleteGroup` (deleteGroup은 하위 note도 함께 제거 + storage notes/noteBodies 동기화)
-   [ ] `updateTag`, `deleteTag` (deleteTag는 모든 note의 tagIds에서 해당 id 제거)
-   [ ] `updateNote`, `deleteNote` (deleteNote는 noteBodies에서도 제거)
-   [ ] note의 `updatedAt`은 update 시 갱신

### lib

-   [ ] `lib/storage.ts`에 누락 시 `deleteNoteBody(id)` 추가 (cascade에서 사용)

### UI: `src/sidepanel/components/library/`

-   [ ] group 목록 사이드 영역: 목록 + 추가 + 이름 수정 + 삭제(확인 confirm)
-   [ ] 선택된 group의 note 목록: createdAt 내림차순, favicon+title+url 카드
-   [ ] tag 필터 UI: 전역 tag 목록에서 선택 → 기본 전역 필터, "현재 group만" 체크박스로 범위 한정
-   [ ] note 추가(빈 폼 또는 최소 입력) / note 카드 클릭 → 상세 패널
-   [ ] note 상세 패널: 제목·tagIds 수정, memo(body) textarea (열 때 lazy load, 저장 시 `setNoteBody`)
-   [ ] tag 관리: tag 추가/이름수정/삭제 UI (전역, group 무관)
-   [ ] `App.tsx`: 임시 검증 코드 제거, library 뷰를 위 컴포넌트들로 교체

## 검증

-   group/tag/note 각각 추가·수정·삭제가 UI에서 동작
-   tag 필터: 전역 필터와 "현재 group 한정" 둘 다 동작
-   note 최신순 정렬 확인
-   group 삭제 시 confirm 모달 → 확인하면 하위 note(및 body) 통째 삭제
-   tag 삭제 시 note는 유지되고 tagIds에서만 제거
-   note 상세에서 memo 작성 → 패널 닫고 다시 열어도 복원(lazy load 확인)

## 진행 기록

-   계획 수립 완료.
