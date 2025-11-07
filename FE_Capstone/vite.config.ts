import { defineConfig } from "vite";
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [VitePWA({ registerType: "autoUpdate" })],
});
