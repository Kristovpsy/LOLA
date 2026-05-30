import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useWishes() {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!supabase) {
      // Fallback demo wishes when Supabase isn't configured
      setWishes([
        {
          id: 'demo-1',
          name: 'The Gang',
          message: 'Happy Birthday Lola! You are the most chaotic person we know and we love you for it 🖤',
          timestamp: new Date().toISOString(),
          position_x: 0.1,
          position_y: 0.3,
          rotation: -0.2
        },
        {
          id: 'demo-2',
          name: 'Your Crew',
          message: 'Another year of absolute mayhem with you. Here\'s to many more! 🎸',
          timestamp: new Date().toISOString(),
          position_x: -0.3,
          position_y: -0.1,
          rotation: 0.15
        }
      ])
      setLoading(false)
      return
    }

    // Initial fetch
    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('timestamp', { ascending: true })
      
      if (error) {
        console.error('[useWishes] fetch error:', error)
      } else {
        setWishes(data || [])
      }
      setLoading(false)
    }

    fetchWishes()

    // Real-time subscription
    const channel = supabase
      .channel('wishes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wishes' },
        (payload) => {
          setWishes(prev => {
            if (prev.find(w => w.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  const addWish = async ({ name, message }) => {
    const position_x = (Math.random() - 0.5) * 4
    const position_y = (Math.random() - 0.5) * 3
    const rotation = (Math.random() - 0.5) * 0.5

    if (!supabase) {
      // Optimistic local add for demo mode
      setWishes(prev => [...prev, {
        id: `local-${Date.now()}`,
        name,
        message,
        timestamp: new Date().toISOString(),
        position_x,
        position_y,
        rotation
      }])
      return { success: true }
    }

    const { error } = await supabase.from('wishes').insert([{
      name,
      message,
      timestamp: new Date().toISOString(),
      position_x,
      position_y,
      rotation
    }])

    if (error) {
      console.error('[useWishes] insert error:', error)
      return { success: false, error }
    }
    return { success: true }
  }

  return { wishes, loading, addWish }
}
