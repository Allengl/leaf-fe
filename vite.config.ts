import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport, { VantResolve } from 'vite-plugin-style-import';
import { VitePWA } from 'vite-plugin-pwa'
// @ts-nocheck
import { svgstore } from './src/vite_plugins/svgstore';

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  return {
    define: command === 'build' ? {
      DEBUG: false
    } : {
      DEBUG: true
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: any) {
            if (id.includes('echarts')) {
              return 'echarts';
            }
            if (id.includes('mock') || id.includes('faker')) {
              return 'mock';
            }
            if (id.includes('vant')) {
              return 'vant';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        mergeProps: true
      }),
      svgstore(),
      styleImport({
        resolves: [VantResolve()],
      }),
      VitePWA({
        devOptions: {
          enabled: true
          /* other options */
        },
        includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          name: '叶子记账',
          short_name: '叶子',
          description: '叶子记账',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      proxy: {
        '/api/v1': {
          target: 'http://106.14.66.155:3000/',
        }
      }
    }
  }
})
