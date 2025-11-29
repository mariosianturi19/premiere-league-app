import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'League App Official',
        short_name: 'LeagueApp',
        description: 'Official Premiere League Database & Schedule',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // Kamu harus siapkan icon ini di folder public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Kamu harus siapkan icon ini di folder public
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
  },
})