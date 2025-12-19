'use client'

import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
    OrbitControls,
    PerspectiveCamera,
    Stars,
    Float,
    Sparkles,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function GalaxyTree() {
    const pointsRef = useRef<THREE.Points>(null!)

    const { positions, colors } = useMemo(() => {
        const count = 7000
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            const t = Math.random()
            const height = t * 6 - 3

            const angle = t * Math.PI * 24 + Math.random() * 1.5
            const radius = (1 - t) * (2.6 + Math.random() * 0.4)

            const x = Math.cos(angle) * radius
            const y = height
            const z = Math.sin(angle) * radius

            positions.set([x, y, z], i * 3)

            const h = (height + 3) / 6
            const color = new THREE.Color()
            color.setHSL(0.12 + h * 0.08, 1, 0.6)

            colors.set([color.r, color.g, color.b], i * 3)
        }

        return { positions, colors }
    }, [])

    useFrame(() => {
        pointsRef.current.rotation.y += 0.0012
    })

    return (
        <group>
            {/* Thân cây */}
            <mesh>
                <coneGeometry args={[0.7, 6.2, 32]} />
                <meshStandardMaterial
                    color="#3a2a1a"
                    emissive="#1a0e05"
                    transparent
                    opacity={0.18}
                />
            </mesh>

            {/* Sao đỉnh */}
            <mesh position={[0, 3.2, 0]}>
                <icosahedronGeometry args={[0.28, 1]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffd700"
                    emissiveIntensity={2.5}
                />
                <pointLight intensity={16} distance={12} color="#ffd700" />
            </mesh>

            {/* Particle */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[colors, 3]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    size={0.05}
                    vertexColors
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>

            <Sparkles count={280} scale={6} size={2} speed={0.35} />
        </group>
    )
}

export default function Page() {
    return (
        <div className="h-screen w-full bg-[#020205]">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0.5, 11]} fov={42} />

                <Stars radius={100} depth={50} count={4200} factor={4} fade />

                <ambientLight intensity={0.3} />
                <directionalLight position={[6, 10, 4]} intensity={1} />
                <pointLight position={[-4, 2, -3]} intensity={0.6} color="#88ccff" />

                <Float speed={1.4} floatIntensity={0.4} rotationIntensity={0.3}>
                    <GalaxyTree />
                </Float>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.25}
                />

                <EffectComposer>
                    <Bloom
                        intensity={1.2}
                        luminanceThreshold={0.15}
                        luminanceSmoothing={0.85}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
