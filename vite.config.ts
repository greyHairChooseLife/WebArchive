import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config.ts'

// https://vite.dev/config/
export default defineConfig({
  // vite 빌드를 위한 설정을 추상화해서 선언적으로 사용. crx는 브라우저 확장프로그램용 설정을 주입
  plugins: [react(), crx({ manifest })],
})
