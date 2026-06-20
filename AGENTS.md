# 프로젝트 소개

북마크를 대체하는 **탭 매니저 + 아카이브** Chrome 확장(MV3). 기존 북마크의 "한 폴더에만
넣을 수 있음" 한계를 **group(상호배타) + 전역 tag(다대다)** 구조로 해소한다.

-   라이브 탭을 윈도우/도메인/시간대 관점으로 보고, 골라서 note로 가져와 보관
-   계층: group → note, 전역 tag를 note에 여러 개 부착
-   note는 url/title/favicon 등 메타 + lazy body(미래엔 Notion식 리치 문서)로 구성
-   UI는 Side Panel 단독([탭]/[라이브러리] 토글), 데이터는 `chrome.storage.local`에 로컬 저장
-   스택: React + Vite + CRXJS (TypeScript, npm, Zustand, CSS Modules, Biome)

상세는 `docs/` 참조.

# 응답 규칙

-   응답은 항상 한국어
-   장황한 설명을 피하고 명료하게 표현

# Documentation Guide

-   아래 문서들을 참고해 필요한 정보를 찾고 수정한다.
-   결정·범위·구조가 바뀌면 관련 문서를 같은 변경에서 함께 갱신한다.
-   문서 간 상충이 있으면 decisions.md를 우선한다.

## docs/ 문서 목록

| 문서 | 읽을 때 | 업데이트할 때 |
|------|---------|-------------|
| [architecture.md](docs/architecture.md) | 전체 구조 복기 / 새 기능 설계 전 / 데이터 모델·스토리지 레이아웃 확인 / 상태 관리·컴포넌트 책임 확인 | 데이터 모델 변경 / 스토리지 키·전략 변경 / 상태 관리 구조 변경 / SW·Side Panel 책임 변경 |
| [features.md](docs/features.md) | 특정 동작이 버그인지 의도된 것인지 판단할 때 / MVP·나중·비범위 경계 확인 / 다음 작업 우선순위 | 기능 완료·제거·변경 시 즉시 / MVP↔나중 범위 이동 시 / 미해결 UX 항목 해소 시 (가장 자주 업데이트) |
| [decisions.md](docs/decisions.md) | "왜 이렇게 만들었지?" 의문이 생길 때 / 기술 스택 교체 고려 시 / 설계 판단 전 충돌 여부 확인 | 주요 라이브러리·프레임워크 교체 / 아키텍처 방향 변경 / 기존 결정 번복 시 / 미해결 항목 확정 시 |
| [contributing.md](docs/contributing.md) | 코드 작성·배치 전 / 디렉토리 구조 확인 / 코드 규칙 확인 / 문서 동기화 규칙 확인 | 디렉토리 구조 확정·변경 / 코드 규칙 추가 / 언어·스타일링 방식 결정 시 |
| [runbook.md](docs/runbook.md) | 개발 환경 세팅 / 빌드·확장 로드 절차 / 데이터 백업·복원 | 패키지 매니저·스크립트 확정 / 빌드 절차 변경 / 테스트·린트 도구 추가 |
| [roadmap.md](docs/roadmap.md) | 다음 작업 확인 / 현재 어느 단계인지 / 단계별 범위·검증 기준 (상세는 `roadmap/{active,done}/`) | 단계 시작 시 `active/`에 상세 계획 문서 작성 / 완료 시 상태표 갱신 + 문서를 `done/`으로 이동 |

# git commit message rule

-   semantic keyword를 사용
-   한글로 작성
-   간단명료하게 작성

