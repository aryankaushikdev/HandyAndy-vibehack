import { defineConfig } from 'vite'

// Dev server runs over plain HTTP. The browser camera API (getUserMedia) treats
// `localhost` as a secure context even without HTTPS, so the camera works fine
// when you develop on your laptop at http://localhost:5173.
//
// For testing ON YOUR PHONE, deploy to Vercel (real HTTPS) — see README. Camera
// access from a phone over your LAN needs real HTTPS, which a self-signed dev cert
// can't provide cleanly (phones reject it). Vercel is the right path for that.
export default defineConfig({
  server: { host: true },
})
