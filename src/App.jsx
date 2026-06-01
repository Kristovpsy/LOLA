import { useState, useCallback, useEffect } from 'react'
import Preloader from './components/Preloader/Preloader'
import ScrollJourney from './components/ScrollJourney/ScrollJourney'
import LoginGate from './components/Login/LoginGate'
import WishWall from './components/WishWall/WishWall'
import AudioToggle from './components/AudioToggle/AudioToggle'
import PrivateWishes from './components/PrivateWishes/PrivateWishes'
import { useWishes } from './hooks/useWishes'

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route
}

export default function App() {
  const route = useHashRoute()
  const [loaded, setLoaded] = useState(false)
  const [scrollDone, setScrollDone] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [flashEnabled, setFlashEnabled] = useState(true)
  const [warningDismissed, setWarningDismissed] = useState(false)
  const { wishes, addWish } = useWishes()

  const isPrivate = route === '#/lola'

  // Cursor trail for Era 6 (only on main site)
  useEffect(() => {
    if (isPrivate) return
    const dots = []
    const MAX_DOTS = 12

    const onMove = (e) => {
      const dot = document.createElement('div')
      dot.className = 'cursor-dot'
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
      document.body.appendChild(dot)
      dots.push(dot)
      setTimeout(() => {
        dot.style.opacity = '0'
        setTimeout(() => dot.remove(), 300)
      }, 100)
      while (dots.length > MAX_DOTS) {
        const old = dots.shift()
        old?.remove()
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [isPrivate])

  const handleScrollComplete = useCallback(() => {
    setScrollDone(true)
  }, [])

  const handleLogin = useCallback((name) => {
    setUserName(name)
    setLoggedIn(true)
  }, [])

  const handleAddWish = useCallback(async ({ name, message }) => {
    return await addWish({ name, message })
  }, [addWish])

  // Private wishes page — separate route
  if (isPrivate) {
    return <PrivateWishes />
  }

  return (
    <>
      {/* ── Preloader ── */}
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* ── Flash / Strobe Warning Banner ── */}
      {loaded && !warningDismissed && (
        <div id="flash-warning" role="alert">
          <span>⚠️ This site contains flashing lights and rapid animations.</span>
          <label htmlFor="flash-toggle">
            <input
              id="flash-toggle"
              type="checkbox"
              checked={!flashEnabled}
              onChange={e => setFlashEnabled(!e.target.checked)}
            />
            Disable flash effects
          </label>
          <button
            id="flash-warning-dismiss"
            onClick={() => setWarningDismissed(true)}
            aria-label="Dismiss warning"
          >
            GOT IT
          </button>
        </div>
      )}

      {/* ── Main Content (hidden until loaded) ── */}
      {loaded && (
        <>
          {/* Scroll journey — always mounted but hidden after login */}
          {!loggedIn && (
            <div style={{ display: scrollDone ? 'none' : 'block' }}>
              <ScrollJourney
                onScrollComplete={handleScrollComplete}
                flashEnabled={flashEnabled}
              />
            </div>
          )}

          {/* Login Gate — shown after scroll, before login */}
          {scrollDone && !loggedIn && (
            <LoginGate onSuccess={handleLogin} />
          )}

          {/* Wish Wall — shown after login */}
          {loggedIn && (
            <WishWall
              userName={userName}
              wishes={wishes}
              onAddWish={handleAddWish}
            />
          )}

          {/* Audio Toggle — always visible */}
          <AudioToggle />
        </>
      )}
    </>
  )
}
