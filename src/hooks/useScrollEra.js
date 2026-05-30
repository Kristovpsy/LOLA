import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const ERA_COUNT = 6

// Scroll positions as fractions (0–1) for each era start
export const ERA_THRESHOLDS = [0, 1/7, 2/7, 3/7, 4/7, 5/7]

export function useScrollEra() {
  const [currentEra, setCurrentEra] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const triggerRef = useRef(null)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#scroll-journey',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        setScrollProgress(progress)

        // Determine which era we're in
        let era = 0
        for (let i = ERA_THRESHOLDS.length - 1; i >= 0; i--) {
          if (progress >= ERA_THRESHOLDS[i]) {
            era = i
            break
          }
        }
        setCurrentEra(era)
      }
    })

    triggerRef.current = trigger

    return () => {
      trigger.kill()
    }
  }, [])

  // Era-local progress (0–1 within current era)
  const eraProgress = scrollProgress >= ERA_THRESHOLDS[currentEra]
    ? Math.min(
        1,
        (scrollProgress - ERA_THRESHOLDS[currentEra]) / (1 / 7)
      )
    : 0

  return { currentEra, scrollProgress, eraProgress }
}
