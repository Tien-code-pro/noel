'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation' // Thêm cái này
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
    useTransform
} from 'framer-motion'

// Cần bọc trong Suspense để dùng được useSearchParams trong Next.js
function ChristmasContent() {
    const searchParams = useSearchParams()
    // Lấy giá trị từ param 'n' (ví dụ ?n=Tùng). Nếu không có thì hiện "Bạn"
    const rawName = searchParams.get('n') || 'Bạn'
    const name = decodeURIComponent(rawName) // Giải mã tiếng Việt có dấu

    /* ... Các logic Parallax giữ nguyên ... */
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smooth = { damping: 30, stiffness: 120 }
    const dx = useSpring(mouseX, smooth)
    const dy = useSpring(mouseY, smooth)
    const rotateX = useTransform(dy, [-500, 500], [6, -6])
    const rotateY = useTransform(dx, [-500, 500], [-6, 6])
    const translateX = useTransform(dx, [-500, 500], [-30, 30])
    const translateY = useTransform(dy, [-500, 500], [-30, 30])

    const [showWish, setShowWish] = useState(false)
    const [wishKey, setWishKey] = useState(0)

    const handleTreeClick = () => {
        setShowWish(false)
        setTimeout(() => {
            setWishKey(prev => prev + 1)
            setShowWish(true)
        }, 50)
    }

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
            {/* 1. BACKGROUND AURA */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] bg-blue-900/30 blur-[180px] rounded-full" />
                <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-emerald-900/20 blur-[200px] rounded-full" />
            </div>

            {/* 2. TUYẾT RƠI (z-40) */}
            <div className="absolute inset-0 z-40 pointer-events-none">
                {[...Array(60)].map((_, i) => (
                    <motion.div
                        key={`snow-${i}`}
                        className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                        style={{
                            width: Math.random() * 4 + 1 + 'px',
                            height: Math.random() * 4 + 1 + 'px',
                            left: Math.random() * 100 + '%',
                            top: '-5%',
                            opacity: Math.random() * 0.6 + 0.3,
                        }}
                        animate={{
                            y: ['0vh', '110vh'],
                            x: [0, Math.random() * 40 - 20, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                    />
                ))}
            </div>

            {/* 3. TREE CONTAINER (z-20) */}
            <motion.div
                className="relative z-20 flex items-center justify-center cursor-pointer"
                onClick={handleTreeClick}
                style={{ rotateX, rotateY, x: translateX, y: translateY, perspective: 1200 }}
            >
                <motion.div
                    className="absolute w-[450px] h-[450px] bg-amber-400/15 blur-[120px] rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                <motion.img
                    src="/images/noel.png"
                    alt="Christmas Tree"
                    className="w-[360px] md:w-[600px] z-30 select-none pointer-events-none drop-shadow-[0_0_80px_rgba(255,200,120,0.3)]"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* 4. WISH TEXT TỰ ĐỘNG CẬP NHẬT TÊN */}
                <AnimatePresence>
                    {showWish && (
                        <motion.div
                            key={wishKey}
                            className="absolute z-[60] text-center text-white font-serif italic text-xl md:text-3xl px-10 py-5 rounded-full
                         bg-white/10 backdrop-blur-2xl border border-white/20 whitespace-nowrap
                         shadow-[0_0_60px_rgba(255,215,150,0.4)]"
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -320, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 1.8, ease: 'easeOut' }}
                        >
                            <span className="text-amber-300 font-bold">{name}</span> ơi, <br />
                            🎄 Giáng Sinh thật an lành nhé! ✨
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* 5. OVERLAYS */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
    )
}

// Export chính bọc trong Suspense để tránh lỗi Next.js build
export default function LuxuryChristmasLanding() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChristmasContent />
        </Suspense>
    )
}