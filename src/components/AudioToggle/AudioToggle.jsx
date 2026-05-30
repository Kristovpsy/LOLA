import { useState, useRef, useEffect } from 'react'

const CassetteIcon = ({ playing }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cassette body */}
    <rect x="4" y="8" width="56" height="32" rx="3" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
    {/* Label area */}
    <rect x="12" y="14" width="40" height="16" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Left reel */}
    <circle cx="22" cy="22" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"
      style={{
        transformOrigin: '22px 22px',
        animation: playing ? 'spin 1.2s linear infinite' : 'none'
      }}
    />
    <circle cx="22" cy="22" r="2" fill="rgba(255,255,255,0.4)" />
    {/* Right reel */}
    <circle cx="42" cy="22" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"
      style={{
        transformOrigin: '42px 22px',
        animation: playing ? 'spin 1.8s linear infinite reverse' : 'none'
      }}
    />
    <circle cx="42" cy="22" r="2" fill="rgba(255,255,255,0.4)" />
    {/* Tape window */}
    <path d="M28 22 Q32 26 36 22" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
    {/* Bottom holes */}
    <rect x="14" y="34" width="8" height="4" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="42" y="34" width="8" height="4" rx="1" fill="rgba(255,255,255,0.15)"/>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </svg>
)

export default function AudioToggle() {
  const [playing, setPlaying] = useState(false)
  const audioCtxRef = useRef(null)
  const gainRef = useRef(null)
  const audioElRef = useRef(null)
  const oscillatorRef = useRef(null)

  const initAudio = () => {
    if (audioCtxRef.current) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    audioCtxRef.current = ctx
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.connect(ctx.destination)
    gainRef.current = gain

    // Try loading the real audio file first
    const audio = new Audio('/audio/ambient-loop.mp3')
    audio.loop = true
    audioElRef.current = audio

    audio.addEventListener('canplay', () => {
      const src = ctx.createMediaElementSource(audio)
      src.connect(gain)
    }, { once: true })

    audio.load()
    audio.play().catch(() => {
      // Fallback: synthesize an ambient drone
      startSynthDrone(ctx, gain)
    })
  }

  const startSynthDrone = (ctx, gain) => {
    if (oscillatorRef.current) return
    // Layer 2 oscillators for ambient feel
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const osc3 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(55, ctx.currentTime) // A1
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(82.4, ctx.currentTime) // E2
    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(110, ctx.currentTime) // A2

    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.setValueAtTime(0.3, ctx.currentTime)
    lfoGain.gain.setValueAtTime(5, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(osc1.frequency)
    lfo.start()

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.15, ctx.currentTime)
    osc1.connect(masterGain)
    osc2.connect(masterGain)
    osc3.connect(masterGain)
    masterGain.connect(gain)

    osc1.start()
    osc2.start()
    osc3.start()
    oscillatorRef.current = { osc1, osc2, osc3, lfo }
  }

  const toggle = () => {
    initAudio()
    const ctx = audioCtxRef.current
    const gain = gainRef.current
    if (!ctx || !gain) return

    if (ctx.state === 'suspended') ctx.resume()

    if (!playing) {
      gain.gain.setTargetAtTime(0.6, ctx.currentTime, 0.5)
    } else {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5)
    }
    setPlaying(p => !p)
  }

  // Tie scroll velocity to playback rate
  useEffect(() => {
    if (!playing) return
    let lastY = window.scrollY
    const handleScroll = () => {
      const vel = Math.abs(window.scrollY - lastY)
      lastY = window.scrollY
      if (audioElRef.current) {
        audioElRef.current.playbackRate = Math.min(2, 1 + vel / 500)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [playing])

  return (
    <div id="audio-toggle">
      <div className={`eq-bars ${playing ? '' : 'paused'}`} aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="eq-bar" style={{ height: playing ? undefined : '4px' }} />
        ))}
      </div>

      <button
        id="audio-toggle-btn"
        className="cassette-btn"
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause' : 'Play ambient track'}
      >
        <CassetteIcon playing={playing} />
      </button>
    </div>
  )
}
