import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/TugasWeb-Pertemuan5-WeatherApp/',
  plugins: [
    tailwindcss(),
  ],
})