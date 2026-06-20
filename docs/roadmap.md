# Roadmap

MVP 구현 단계 인덱스. 순차 진행(앞 단계가 뒤 단계의 토대).

-   한 단계 = 한 커밋. 흐름: 계획 → 구현 → 검증 → 커밋 → 기록.
-   각 단계의 **상세 계획·진행 기록**은 별도 문서로 관리:
    -   진행 중: `docs/roadmap/active/{NN-step-name}.md`
    -   완료: `docs/roadmap/done/{NN-step-name}.md` (active → done 이동)
-   파일명: 번호 prefix + kebab-case.
-   상태 값: `미완료` / `완료`. 단계 완료 시 (1)상태를 `완료`로 (2)문서를 `done/`으로 옮기고 경로 갱신.
-   "왜 그렇게 했나"는 `decisions.md`, 기능 범위는 `features.md`. 여기는 진행 인덱스.

## 단계

### 1. 프로젝트 셋업

-   상태: 완료
-   문서: `done/01-project-setup.md`
-   범위: Vite + React + CRXJS + TS, npm, Biome, manifest.config.ts
-   검증: `npm run dev`로 빈 Side Panel이 뜬다
-   결정: D11, D21, D22, D24

### 2. 타입 + storage 토대

-   상태: 완료
-   문서: `done/02-types-storage.md`
-   범위: 엔티티 타입, `lib/storage.ts`, `lib/ids.ts`, Zustand store 골격
-   검증: add/load가 storage에 반영되고 새로고침 후 복원된다
-   결정: D5, D7, D13, D21

### 3. 라이브러리 뷰

-   상태: 미완료
-   문서: `03-library-view.md`
-   범위: group/tag/note CRUD, 최신순 정렬, 전역 tag 필터(+현재 group 한정), 삭제 cascade
-   검증: CRUD·필터·삭제가 UI에서 동작
-   결정: features 3·5, D26

### 4. 라이브 탭 뷰

-   상태: 미완료
-   문서: `04-live-tabs-view.md`
-   범위: `lib/tabs.ts` 그룹핑(윈도우/도메인/시간대), 탭 카드, 가져오기 → group 지정
-   검증: 관점 토글 동작, 가져오기로 라이브러리에 note 생성
-   결정: features 1·2, D19, D20, D23

### 5. 데이터 관리 + 마무리

-   상태: 미완료
-   문서: `05-data-and-wrapup.md`
-   범위: JSON export/import(통째 교체), SW로 아이콘 클릭 → 패널 열기 연결
-   검증: import가 전체 데이터를 교체, 아이콘 클릭으로 패널 열림
-   결정: features 6, D14, D24
