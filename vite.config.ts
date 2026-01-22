import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './', // <--- هذا السطر ضروري جداً لحل مشكلة الشاشة البيضاء
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
define: {
  'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // إضافة هذا القسم للتأكد من مجلد المخرجات
      build: {
        outDir: 'dist',
      }
    };
});
