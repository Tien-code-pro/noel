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

            // 🎨 Gradient màu theo chiều cao (gốc ấm → đỉnh sáng)
            const h = (height + 3) / 6 // 0 → 1
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
            {/* Thân cây mờ tạo khối */}
            <mesh>
                <coneGeometry args={[0.7, 6.2, 32]} />
                <meshStandardMaterial
                    color="#3a2a1a"
                    emissive="#1a0e05"
                    transparent
                    opacity={0.18}
                />
            </mesh>

            {/* Sao đỉnh cây */}
            <mesh position={[0, 3.2, 0]}>
                <icosahedronGeometry args={[0.28, 1]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffd700"
                    emissiveIntensity={2.5}
                />
                <pointLight intensity={16} distance={12} color="#ffd700" />
            </mesh>

            {/* Particle cây */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        count={positions.length / 3}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        array={colors}
                        count={colors.length / 3}
                        itemSize={3}
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

            {/* Lấp lánh phụ */}
            <Sparkles
                count={280}
                scale={6}
                size={2}
                speed={0.35}
                color="#ffffff"
            />
        </group>
    )
}

export default function Page() {
    return (
        <div className="h-screen w-full bg-[#020205]">
            <Canvas>
                {/* Camera cinematic */}
                <PerspectiveCamera makeDefault position={[0, 0.5, 11]} fov={42} />

                {/* Không gian sao */}
                <Stars radius={100} depth={50} count={4200} factor={4} fade />

                {/* Ánh sáng */}
                <ambientLight intensity={0.3} />
                <directionalLight position={[6, 10, 4]} intensity={1} />
                <pointLight position={[-4, 2, -3]} intensity={0.6} color="#88ccff" />

                {/* Cây */}
                <Float speed={1.4} floatIntensity={0.4} rotationIntensity={0.3}>
                    <GalaxyTree />
                </Float>

                {/* Điều khiển */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.25}
                />

                {/* 🌟 Bloom dịu – đắt tiền */}
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
