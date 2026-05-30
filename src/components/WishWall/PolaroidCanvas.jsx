import { useRef, useEffect, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

/* ─── Draw a Polaroid card onto a canvas ─── */
function createPolaroidTexture(name, message) {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 380
  const ctx = canvas.getContext('2d')

  // Card background
  ctx.fillStyle = '#f5e6c8'
  ctx.fillRect(0, 0, 320, 380)

  // Paper grain
  ctx.globalAlpha = 0.06
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 320
    const y = Math.random() * 380
    const g = Math.random() * 100
    ctx.fillStyle = `rgb(${g},${g},${g})`
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.globalAlpha = 1

  // Photo area
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(20, 20, 280, 260)

  // Gradient in photo area
  const grad = ctx.createLinearGradient(20, 20, 300, 280)
  grad.addColorStop(0, '#4B0082')
  grad.addColorStop(1, '#C0152A')
  ctx.fillStyle = grad
  ctx.globalAlpha = 0.7
  ctx.fillRect(20, 20, 280, 260)
  ctx.globalAlpha = 1

  // Star decoration in photo
  ctx.fillStyle = '#CC88FF'
  ctx.font = 'bold 48px serif'
  ctx.textAlign = 'center'
  ctx.fillText('🖤', 160, 160)

  // Name
  ctx.fillStyle = '#1a1a1a'
  ctx.font = 'bold 16px "Courier New"'
  ctx.textAlign = 'left'
  ctx.fillText(name || 'Anonymous', 20, 308)

  // Message — word wrap
  ctx.font = '13px "Courier New"'
  ctx.fillStyle = '#333'
  const words = (message || '').split(' ')
  let line = ''
  let y = 328
  const maxWidth = 280
  const lineHeight = 16

  for (const word of words) {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      ctx.fillText(line.trim(), 20, y)
      line = word + ' '
      y += lineHeight
      if (y > 370) break
    } else {
      line = testLine
    }
  }
  if (y <= 370) ctx.fillText(line.trim(), 20, y)

  return new THREE.CanvasTexture(canvas)
}

/* ─── Single Polaroid mesh with physics ─── */
function Polaroid({ wish, index }) {
  const texture = useMemo(() => createPolaroidTexture(wish.name, wish.message), [wish.name, wish.message])
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  const initPos = useMemo(() => [
    wish.position_x || (Math.random() - 0.5) * 6,
    wish.position_y || (Math.random() - 0.5) * 4,
    (index % 3) * 0.05
  ], [wish, index])

  const initRot = useMemo(() => [0, 0, wish.rotation || (Math.random() - 0.5) * 0.5], [wish, index])

  useFrame(() => {
    if (!meshRef.current) return
    const targetScale = hovered ? 1.12 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <RigidBody
      position={initPos}
      rotation={initRot}
      linearDamping={3}
      angularDamping={3}
      colliders="cuboid"
      gravityScale={0}
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[1.6, 1.9]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          emissive={hovered ? '#CC88FF' : '#000000'}
          emissiveIntensity={hovered ? 0.15 : 0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </RigidBody>
  )
}

/* ─── Camera controller ─── */
function CameraController() {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const camOffset = useRef({ x: 0, y: 0 })
  const zoom = useRef(5)

  useEffect(() => {
    const canvas = gl.domElement
    const onDown = e => {
      isDragging.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
    }
    const onMove = e => {
      if (!isDragging.current) return
      const dx = (e.clientX - lastPos.current.x) * 0.01
      const dy = (e.clientY - lastPos.current.y) * 0.01
      camOffset.current.x -= dx
      camOffset.current.y += dy
      lastPos.current = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => { isDragging.current = false }
    const onWheel = e => {
      e.preventDefault()
      zoom.current = Math.max(2, Math.min(12, zoom.current + e.deltaY * 0.005))
    }
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  useFrame(() => {
    camera.position.x += (camOffset.current.x - camera.position.x) * 0.08
    camera.position.y += (camOffset.current.y - camera.position.y) * 0.08
    camera.position.z += (zoom.current - camera.position.z) * 0.1
  })

  return null
}

/* ─── Main Polaroid Canvas ─── */
export default function PolaroidCanvas({ wishes }) {
  return (
    <div
      className="polaroid-canvas-panel"
      style={{ cursor: 'grab', userSelect: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'rgba(10,10,10,0.95)', borderRadius: '0' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 3]} intensity={0.4} color="#CC88FF" />

        <CameraController />

        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            {wishes.map((wish, i) => (
              <Polaroid key={wish.id} wish={wish} index={i} />
            ))}
          </Physics>
        </Suspense>
      </Canvas>

      <div style={{
        position: 'absolute', bottom: '16px', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-body)', fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em',
        pointerEvents: 'none', whiteSpace: 'nowrap'
      }}>
        DRAG · SCROLL TO ZOOM · HOVER TO GLOW
      </div>
    </div>
  )
}
