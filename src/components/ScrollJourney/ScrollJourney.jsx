import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SceneCanvas from '../ThreeCanvas/SceneCanvas'
import { useScrollEra } from '../../hooks/useScrollEra'

gsap.registerPlugin(ScrollTrigger)

const ERA_DATA = [
  {
    id: 'era-1',
    className: 'era-1-bg',
    label: 'WHEN WE ALL FALL ASLEEP',
    sublabel: 'where do we go?',
    titleClass: 'era-1-text glitch-text',
    effects: ['scanlines', 'noise-flash'],
    textStyle: {}
  },
  {
    id: 'era-2',
    className: 'era-2-bg',
    label: 'HAPPIER THAN EVER',
    sublabel: 'an ocean of feeling',
    titleClass: 'era-2-text wavy',
    effects: ['caustic-overlay'],
    textStyle: {}
  },
  {
    id: 'era-3',
    className: 'era-3-bg',
    label: 'HIT ME HARD AND SOFT',
    sublabel: 'the dark era',
    titleClass: 'era-3-text',
    effects: ['noise-flash'],
    textStyle: {}
  },
  {
    id: 'era-4',
    className: 'era-4-bg',
    label: 'PURELY LOLA',
    sublabel: 'minimalist. angelic. brutal.',
    titleClass: 'era-4-text',
    effects: ['film-burn', 'vignette'],
    textStyle: {}
  },
  {
    id: 'era-5',
    className: 'era-5-bg',
    label: 'BLUSH',
    sublabel: 'energy. anger. joy.',
    titleClass: 'era-5-text strobe-text',
    effects: [],
    textStyle: {}
  },
  {
    id: 'era-6',
    className: 'era-6-bg',
    label: 'FINALE',
    sublabel: 'the portal opens',
    titleClass: 'era-6-text',
    effects: ['vignette'],
    textStyle: {}
  }
]

export default function ScrollJourney({ onScrollComplete, flashEnabled }) {
  const { currentEra, scrollProgress, eraProgress } = useScrollEra()
  const flashOverlayRef = useRef(null)
  const [era4Triggered, setEra4Triggered] = useState(false)
  const prevEraRef = useRef(0)

  // Flash-bang trigger when entering Era 4
  useEffect(() => {
    if (currentEra === 3 && prevEraRef.current !== 3 && flashEnabled) {
      const overlay = document.getElementById('flash-overlay')
      if (overlay) {
        gsap.fromTo(overlay,
          { opacity: 1 },
          { opacity: 0, duration: 1.2, ease: 'power2.out' }
        )
      }
    }
    prevEraRef.current = currentEra
  }, [currentEra, flashEnabled])

  // White noise flash for Era 3
  useEffect(() => {
    if (currentEra !== 2) return
    const noiseEl = document.querySelector('.era-noise-flash')
    if (!noiseEl) return
    const interval = setInterval(() => {
      noiseEl.style.opacity = Math.random() < 0.08 ? '1' : '0'
    }, 100)
    return () => clearInterval(interval)
  }, [currentEra])

  // Trigger wish wall when past final era
  useEffect(() => {
    if (scrollProgress > 0.92 && onScrollComplete) {
      onScrollComplete()
    }
  }, [scrollProgress, onScrollComplete])

  return (
    <>
      {/* Fixed 3D canvas behind everything */}
      <SceneCanvas
        currentEra={currentEra}
        scrollProgress={scrollProgress}
        eraProgress={eraProgress}
      />

      {/* Flash overlay (Era 4) */}
      <div id="flash-overlay" style={{
        position: 'fixed', inset: 0, background: '#fff',
        zIndex: 9990, pointerEvents: 'none', opacity: 0
      }} />

      {/* Scanlines (always on) */}
      <div className="scanlines" aria-hidden="true" />

      {/* 700vh scroll container */}
      <div id="scroll-journey">
        {ERA_DATA.map((era, i) => (
          <EraPanel
            key={era.id}
            era={era}
            index={i}
            isActive={currentEra === i}
            eraProgress={currentEra === i ? eraProgress : 0}
          />
        ))}

        {/* Final 100vh for wish wall trigger */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            color: '#CC88FF',
            textShadow: '0 0 40px #CC88FF',
            letterSpacing: '0.2em',
            opacity: scrollProgress > 0.88 ? 1 : 0,
            transition: 'opacity 0.8s ease'
          }}>
            ↓ ENTER THE PIT ↓
          </div>
        </div>
      </div>
    </>
  )
}

function EraPanel({ era, index, isActive, eraProgress }) {
  return (
    <div
      id={era.id}
      className={`era-panel ${era.className}`}
      style={{
        opacity: isActive ? 1 : 0.3,
        transition: 'opacity 0.5s ease',
        position: 'relative'
      }}
    >
      {/* Era-specific effects */}
      {era.effects.includes('vignette') && <div className="vignette" aria-hidden="true" />}
      {era.effects.includes('film-burn') && <div className="film-burn" aria-hidden="true" />}
      {era.effects.includes('noise-flash') && (
        <div className="era-noise-flash" style={{
          position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
          background: '#fff', opacity: 0, transition: 'opacity 0.05s'
        }} aria-hidden="true" />
      )}
      {era.effects.includes('caustic-overlay') && <CausticOverlay />}

      {/* Era number */}
      <div style={{
        position: 'absolute', top: '32px', left: '32px',
        fontFamily: 'var(--font-body)', fontSize: '0.7rem',
        letterSpacing: '0.3em', opacity: 0.4,
        color: index === 3 ? '#333' : '#fff',
        zIndex: 10
      }}>
        0{index + 1} / 06
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        padding: '0 5vw', maxWidth: '900px'
      }}>
        <h2
          className={`display-heading ${era.titleClass}`}
          data-text={era.label}
          style={era.textStyle}
        >
          {era.label}
        </h2>
        <p className="subheading mt-4" style={{
          color: index === 3 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
        }}>
          {era.sublabel}
        </p>

        {/* Scroll progress line */}
        <div style={{
          marginTop: '40px', width: '120px', height: '2px',
          background: 'rgba(255,255,255,0.15)', margin: '40px auto 0',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            background: index === 3 ? '#111' : 'currentColor',
            width: `${eraProgress * 100}%`,
            transition: 'width 0.1s linear'
          }} />
        </div>
      </div>

      {/* Lola name — only Era 4 (white bg) as centered easter egg */}
      {index === 3 && (
        <div style={{
          position: 'absolute', bottom: '60px', right: '5vw',
          fontFamily: 'var(--font-body)', fontSize: '0.65rem',
          letterSpacing: '0.4em', color: '#999', zIndex: 10
        }}>
          FOR LOLA — ALWAYS
        </div>
      )}
    </div>
  )
}

function CausticOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 60%, rgba(77,170,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(77,170,255,0.1) 0%, transparent 50%)',
        animation: 'causticMove 4s ease-in-out infinite alternate'
      }}
    />
  )
}
