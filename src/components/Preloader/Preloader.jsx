import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const fakeProgressRef = useRef(null)

  useEffect(() => {
    // Listen to Three.js loading manager
    THREE.DefaultLoadingManager.onProgress = (_url, loaded, total) => {
      setProgress(Math.round((loaded / Math.max(total, 1)) * 100))
    }

    THREE.DefaultLoadingManager.onLoad = () => {
      setProgress(100)
    }

    // Fake progress to at least get to 30% quickly (for pages with no 3D assets to load)
    let fakeVal = 0
    fakeProgressRef.current = setInterval(() => {
      fakeVal += Math.random() * 8
      setProgress(p => Math.min(p, Math.min(fakeVal, 85)))
      if (fakeVal >= 85) clearInterval(fakeProgressRef.current)
    }, 100)

    // Force complete after 3s regardless
    const forceComplete = setTimeout(() => {
      setProgress(100)
    }, 3000)

    return () => {
      clearInterval(fakeProgressRef.current)
      clearTimeout(forceComplete)
    }
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setDone(true)
        setTimeout(onComplete, 700)
      }, 400)
    }
  }, [progress, onComplete])

  return (
    <div id="preloader" className={done ? 'hidden' : ''} aria-label="Loading" role="progressbar" aria-valuenow={progress}>
      <div className="preloader-title">LOLA</div>

      <div className="cassette-wrapper">
        <div className="cassette-tape">
          <div className="cassette-reel" style={{
            animation: progress < 100 ? 'spin 2s linear infinite' : 'none'
          }} />
          <div className="cassette-track">
            <div className="cassette-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="cassette-reel" style={{
            animation: progress < 100 ? 'spin 3s linear infinite reverse' : 'none'
          }} />
        </div>
        <div className="cassette-label">
          {progress < 100 ? `LOADING... ${progress}%` : 'READY TO PLAY'}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
