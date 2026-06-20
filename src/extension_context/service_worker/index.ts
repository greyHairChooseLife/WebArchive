// SW가 깨어날 때마다(설치/업데이트, 브라우저 시작, 이벤트로 재기동) 매번 실행됨.
// 멱등 호출이라 반복 실행돼도 안전 — 별도 onInstalled 가드 불필요.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
