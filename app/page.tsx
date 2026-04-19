'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

const VantaGlobe = dynamic(() => import('@/components/VantaGlobe'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <VantaGlobe />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
            <BookOpen className="w-4 h-4" />
            Timedoor Coding Academy
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight"
        >
          Report{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Generator
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed"
        >
          Buat laporan pembelajaran murid dengan cepat dan mudah.
          Pilih course, lesson, dan kirim langsung ke orang tua via WhatsApp.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {['✨ Generate Otomatis', '📋 Copy Teks', '💬 Kirim via WhatsApp', '👥 Multi Murid'].map((f) => (
            <span key={f} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link href="/generator">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Buat Report Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
