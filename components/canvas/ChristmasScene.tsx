'use client'

import React, { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function LuxuryChristmasLanding() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const smooth = { damping: 30, stiffness: 120 }
    const dx = useSpring(mouseX, smooth)
    const dy = useSpring(mouseY, smooth)

    const rotateX = useTransform(dy, [-500, 500], [6, -6])
    const rotateY = useTransform(dx, [-500, 500], [-6, 6])
    const translateX = useTransform(dx, [-500, 500], [-30, 30])
    const translateY = useTransform(dy, [-500, 500], [-30, 30])

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mouseX.set(e.clientX - window.innerWidth / 2)
            mouseY.set(e.clientY - window.innerHeight / 2)
        }
        window.addEventListener('mousemove', move)
        return () => window.removeEventListener('mousemove', move)
    }, [mouseX, mouseY])

    return (
        <div className="relative min-h-screen w-full bg-[#03030b] overflow-hidden flex items-center justify-center">

            {/* BACKGROUND AURA */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] bg-blue-900/30 blur-[180px] rounded-full" />
                <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-emerald-900/20 blur-[200px] rounded-full" />
            </div>

            {/* STARFIELD (Lớp sao nền) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2,
                            height: Math.random() * 2,
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* FIX: HIỆU ỨNG TUYẾT RƠI (Đã đẩy z-index lên z-40 để hiện trên cây) */}
            <div className="absolute inset-0 z-40 pointer-events-none">
                {[...Array(60)].map((_, i) => {
                    const size = Math.random() * 4 + 1; // Tạo hạt to nhỏ khác nhau
                    return (
                        <motion.div
                            key={`snow-${i}`}
                            className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                            style={{
                                width: size,
                                height: size,
                                left: Math.random() * 100 + '%',
                                top: '-5%', // Bắt đầu từ phía trên màn hình
                                opacity: Math.random() * 0.7 + 0.3,
                                filter: size > 3 ? 'blur(1px)' : 'none', // Hạt to thì hơi nhòe tạo chiều sâu
                            }}
                            animate={{
                                y: ['0vh', '105vh'],
                                x: [0, Math.random() * 50 - 25, 0] // Lắc lư sang trái phải
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: Math.random() * 10 // Để tuyết không rơi cùng lúc
                            }}
                        />
                    )
                })}
            </div>

            {/* TREE CONTAINER */}
            <motion.div
                className="relative z-20 flex items-center justify-center"
                style={{
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: translateY,
                    perspective: 1200
                }}
            >
                {/* HALO */}
                <motion.div
                    className="absolute w-[450px] h-[450px] bg-amber-400/15 blur-[120px] rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                {/* TREE IMAGE */}
                <motion.img
                    src="/images/noel.png"
                    alt="Christmas Tree"
                    className="w-[360px] md:w-[600px] z-30 select-none pointer-events-none drop-shadow-[0_0_80px_rgba(255,200,120,0.3)]"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* LED LIGHTS TRÊN CÂY */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`led-${i}`}
                        className="absolute w-2 h-2 rounded-full z-40"
                        style={{
                            top: `${30 + Math.random() * 50}%`,
                            left: `${35 + Math.random() * 30}%`,
                            backgroundColor: i % 2 === 0 ? '#ffd166' : '#ffffff',
                            boxShadow: '0 0 15px currentColor'
                        }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </motion.div>

            {/* LIGHT SWEEP & GRAIN */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <motion.div
                className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-amber-500/5 via-transparent to-blue-500/5"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
        </div>
    )
}