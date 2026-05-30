import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useScrollEra } from '../../hooks/useScrollEra'
import * as THREE from 'three'

/* ─── Era 1: Floating glowing chains ─── */
function GlowChains() {
  const groupRef = useRef()
  const chainRefs = useRef([])

  const chains = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 3
    ],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    scale: 0.3 + Math.random() * 0.5
  })), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    chains.forEach((chain, i) => {
      const ref = chainRefs.current[i]
      if (!ref) return
      ref.rotation.x = chain.rotation[0] + t * 0.3
      ref.rotation.y = chain.rotation[1] + t * 0.2
      ref.position.y = chain.position[1] + Math.sin(t * 0.8 + i) * 0.3
    })
  })

  return (
    <group ref={groupRef}>
      {chains.map((chain, i) => (
        <mesh
          key={chain.id}
          ref={el => chainRefs.current[i] = el}
          position={chain.position}
          scale={chain.scale}
        >
          <torusGeometry args={[1, 0.15, 8, 24]} />
          <meshStandardMaterial
            color="#00FF41"
            emissive="#00FF41"
            emissiveIntensity={1.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Era 2: Vinyl disc + liquid droplets ─── */
function VinylAndDroplets() {
  const vinylRef = useRef()
  const dropletsRef = useRef([])
  const droplets = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2],
    scale: 0.1 + Math.random() * 0.3
  })), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (vinylRef.current) {
      vinylRef.current.rotation.z = t * 0.5
    }
    droplets.forEach((d, i) => {
      const ref = dropletsRef.current[i]
      if (!ref) return
      ref.position.y = d.position[1] + Math.sin(t * 0.6 + i * 0.8) * 0.4
    })
  })

  return (
    <group>
      <mesh ref={vinylRef} position={[1.5, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.08, 48]} />
        <meshStandardMaterial color="#1A3A6B" roughness={0.05} metalness={0.9} envMapIntensity={1} />
      </mesh>
      <mesh position={[1.5, 0, 0.05]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#4DAAFF" emissive="#4DAAFF" emissiveIntensity={0.8} />
      </mesh>
      {droplets.map((d, i) => (
        <mesh key={d.id} ref={el => dropletsRef.current[i] = el} position={d.position} scale={d.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial
            color="#4DAAFF"
            transparent
            opacity={0.6}
            roughness={0}
            metalness={0.1}
            transmission={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Era 3: Spikes + barbed wire ─── */
function SpikesAndWire() {
  const spikeRef = useRef()
  const wireRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (spikeRef.current) spikeRef.current.rotation.y = t * 0.4
    if (wireRef.current) {
      wireRef.current.rotation.x = t * 0.3
      wireRef.current.rotation.z = t * 0.2
    }
  })

  return (
    <group>
      <mesh ref={spikeRef}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.7} wireframe={false} />
      </mesh>
      <mesh ref={wireRef} scale={1.4}>
        <torusKnotGeometry args={[1, 0.08, 128, 8]} />
        <meshStandardMaterial color="#888888" roughness={0.5} metalness={0.9} />
      </mesh>
    </group>
  )
}

/* ─── Era 4: Torn paper planes ─── */
function TornPaper() {
  const planesRef = useRef([])
  const planes = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3],
    rotation: [Math.random() * 0.3, Math.random() * Math.PI * 2, Math.random() * 0.3],
    scale: 0.5 + Math.random() * 1.5
  })), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    planes.forEach((p, i) => {
      const ref = planesRef.current[i]
      if (!ref) return
      ref.rotation.y = p.rotation[1] + Math.sin(t * 0.4 + i) * 0.1
      ref.position.y = p.position[1] + Math.sin(t * 0.3 + i * 0.5) * 0.15
    })
  })

  return (
    <group>
      {planes.map((p, i) => (
        <mesh key={p.id} ref={el => planesRef.current[i] = el} position={p.position} rotation={p.rotation} scale={p.scale}>
          <planeGeometry args={[1.4, 1]} />
          <meshStandardMaterial color="#f0e8d5" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ─── Era 5: Exploding points ─── */
function ExplosionPoints({ eraProgress }) {
  const pointsRef = useRef()
  const count = 800

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const init = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.5 + Math.random() * 0.5
      init[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      init[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      init[i * 3 + 2] = r * Math.cos(phi)
      pos[i * 3]     = init[i * 3]
      pos[i * 3 + 1] = init[i * 3 + 1]
      pos[i * 3 + 2] = init[i * 3 + 2]
    }
    return [pos, init]
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const attr = pointsRef.current.geometry.attributes.position
    const explosion = Math.pow(eraProgress, 0.5) * 6
    for (let i = 0; i < count; i++) {
      attr.array[i * 3]     = initialPositions[i * 3]     * (1 + explosion)
      attr.array[i * 3 + 1] = initialPositions[i * 3 + 1] * (1 + explosion)
      attr.array[i * 3 + 2] = initialPositions[i * 3 + 2] * (1 + explosion)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#FF2244" size={0.06} sizeAttenuation />
    </points>
  )
}

/* ─── Era 6: Portal ring + settling convergence ─── */
function PortalRing({ eraProgress }) {
  const torusRef = useRef()
  const ringRef2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.5
      torusRef.current.rotation.y = t * 0.3
      const scale = 0.5 + eraProgress * 1.5
      torusRef.current.scale.setScalar(scale)
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = -t * 0.3
      ringRef2.current.rotation.z = t * 0.2
    }
  })

  return (
    <group>
      <mesh ref={torusRef}>
        <torusGeometry args={[2, 0.12, 16, 80]} />
        <meshStandardMaterial
          color="#CC88FF"
          emissive="#CC88FF"
          emissiveIntensity={2}
          roughness={0}
          metalness={0.5}
        />
      </mesh>
      <mesh ref={ringRef2} scale={0.7}>
        <torusGeometry args={[2, 0.06, 12, 60]} />
        <meshStandardMaterial
          color="#9955FF"
          emissive="#9955FF"
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight color="#CC88FF" intensity={3} distance={8} />
    </group>
  )
}

/* ─── Main Scene Canvas ─── */
export default function SceneCanvas({ currentEra, scrollProgress, eraProgress }) {
  return (
    <div
      className="three-canvas-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: currentEra === 3 ? 0.6 : 1, // Era 4 (index 3) is white bg — dim 3D
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        {currentEra === 0 && <GlowChains />}
        {currentEra === 1 && <VinylAndDroplets />}
        {currentEra === 2 && <SpikesAndWire />}
        {currentEra === 3 && <TornPaper />}
        {currentEra === 4 && <ExplosionPoints eraProgress={eraProgress} />}
        {currentEra === 5 && <PortalRing eraProgress={eraProgress} />}
      </Canvas>
    </div>
  )
}
