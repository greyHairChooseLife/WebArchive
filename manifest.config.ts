import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'WebArchive',
  version: '0.0.0',
  // 확장이 사용할 Chrome API 권한 선언. 여기 없는 API는 호출 시 실패한다.
  // 'tabs': chrome.tabs.query 등에서 url/title 같은 탭 상세 필드 접근 허용.
  // 'storage': chrome.storage.local/sync API 사용 허용.
  // 특정 사이트의 DOM에 접근하려면 host_permissions(예: <all_urls>)가 별도로 필요.
  permissions: ['tabs', 'storage'],
  // side_panel.default_path는 브라우저 Side Panel에 로드할 기본 HTML 진입점.
  // 이 키만 있어도 패널은 등록되며, 사용자가 확장 아이콘 메뉴에서 직접 열 수 있다.
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
  // background.service_worker는 MV3의 SW 스크립트 경로(MV2의 background page 대체).
  // 이벤트(onClicked, onInstalled 등) 발생 시에만 깨어나고, 유휴 시 자동 종료된다.
  // type: 'module'은 SW 코드에서 ES import/export 문법을 쓰기 위함(기본은 classic script).
  background: {
    service_worker: 'src/extension_context/service_worker/index.ts',
    type: 'module',
  },
})
