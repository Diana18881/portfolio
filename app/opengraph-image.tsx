import { ImageResponse } from 'next/og'

export const alt = 'Diana Tsymbaliuk — Frontend Developer, Berlin'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'radial-gradient(circle at 0% 0%, rgba(212,175,55,0.25), #0d0d0d 55%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 10, color: '#d4af37' }}>
          FRONTEND DEVELOPER • UI ENGINEER • BERLIN
        </div>
        <div style={{ marginTop: 32, fontSize: 88, fontWeight: 700 }}>Diana Tsymbaliuk</div>
        <div style={{ marginTop: 24, fontSize: 36, color: 'rgba(255,255,255,0.7)' }}>
          React · Next.js · TypeScript
        </div>
      </div>
    ),
    size,
  )
}
