"use client"

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, MeshTransmissionMaterial, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function RotatingTorus({ status = 'idle' }: { status?: 'idle' | 'safe' | 'warning' | 'critical' }) {
    const meshRef = useRef<THREE.Mesh>(null)

    // Color mapping based on status
    const colors = {
        idle: '#00D4FF', // System Blue
        safe: '#00FF94', // Signal Green
        warning: '#FFA502', // Warning Orange
        critical: '#FF2E2E', // Danger Red
    }

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Speed up rotation based on danger level
            const speedMultiplier = status === 'critical' ? 4 : status === 'warning' ? 2 : 1
            meshRef.current.rotation.x += delta * 0.2 * speedMultiplier
            meshRef.current.rotation.y += delta * 0.3 * speedMultiplier
        }
    })

    const isDistorted = status === 'warning' || status === 'critical'

    return (
        <Float speed={isDistorted ? 5 : 2} rotationIntensity={isDistorted ? 1 : 0.5} floatIntensity={0.5}>
            <Torus ref={meshRef} args={[1.2, 0.4, 32, 64]}>
                {/* 
                   We use MeshTransmissionMaterial for the "Perfect Glass" look.
                   Ideally, we would mix it with MeshDistortMaterial, but R3F materials are tricky to compose.
                   Instead, we'll increase distortion props on the transmission material itself if supported,
                   or just use high chromatic aberration and simple distortion.
                */}
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    thickness={isDistorted ? 0.5 : 0.25}
                    roughness={0}
                    ior={1.5}
                    chromaticAberration={isDistorted ? 0.5 : 0.1}
                    anisotropy={0.1}
                    color={colors[status]}
                    distortion={isDistorted ? 0.8 : 0.3}
                    distortionScale={isDistorted ? 1.0 : 0.5}
                    temporalDistortion={isDistorted ? 0.5 : 0.1}
                />
            </Torus>
        </Float>
    )
}

export default function GlassTorus({ status = 'idle' }: { status?: 'idle' | 'safe' | 'warning' | 'critical' }) {
    return (
        <div className="w-full h-[300px] relative">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <RotatingTorus status={status} />
                <Environment preset="city" />
            </Canvas>
        </div>
    )
}
