import { useState, useEffect } from 'react'
import WishForm from '../WishForm/WishForm'
import PolaroidCanvas from './PolaroidCanvas'

const BG_IMAGES = [
  '/images/lola1.jpg',
  '/images/lola2.jpg',
  '/images/lola3.jpg',
  '/images/lola4.jpg',
]

export default function WishWall({ userName, wishes, onAddWish }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(current)
      setFading(true)
      setCurrent(i => (i + 1) % BG_IMAGES.length)
      setTimeout(() => {
        setPrev(null)
        setFading(false)
      }, 1200)
    }, 5000)
    return () => clearInterval(interval)
  }, [current])

  return (
    <div id="wish-wall" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Background Slideshow ── */}
      <div className="wish-wall-bg-wrap" aria-hidden="true">
        {/* Previous image fading out */}
        {prev !== null && (
          <div
            className="wish-wall-bg-slide wish-wall-bg-slide--out"
            style={{ backgroundImage: `url(${BG_IMAGES[prev]})` }}
          />
        )}
        {/* Current image fading in */}
        <div
          className={`wish-wall-bg-slide ${fading ? 'wish-wall-bg-slide--in' : 'wish-wall-bg-slide--visible'}`}
          style={{ backgroundImage: `url(${BG_IMAGES[current]})` }}
        />
        {/* Dark overlay so content stays readable */}
        <div className="wish-wall-bg-overlay" />
      </div>

      {/* ── Slide indicators ── */}
      <div className="wish-wall-dots" aria-hidden="true">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`wish-wall-dot${i === current ? ' active' : ''}`}
            onClick={() => { setPrev(current); setFading(true); setCurrent(i); setTimeout(() => { setPrev(null); setFading(false) }, 1200) }}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="wish-wall-header">
        HAPPY BIRTHDAY<br />LOLA
        <span>Leave your mark. It's permanent. It's chaos. It's love.</span>
      </div>

      <div className="wish-wall-layout">
        <WishForm onSubmit={onAddWish} />
        <PolaroidCanvas wishes={wishes} />
      </div>

      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        fontFamily: 'var(--font-body)',
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.2)',
        textTransform: 'uppercase',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 1,
      }}>
        Built with love and chaos for Lola 🖤 · {new Date().getFullYear()}
      </div>
    </div>
  )
}
