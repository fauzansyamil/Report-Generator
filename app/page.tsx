'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, ArrowRight, BookOpen, Zap, CheckCircle } from 'lucide-react'

const VantaGlobe = dynamic(() => import('@/components/VantaGlobe'), { ssr: false })

const codeParticles = [
  { text: '<code/>', x: '8%', y: '20%', size: 13, delay: 0 },
  { text: 'print()', x: '85%', y: '15%', size: 12, delay: 0.8 },
  { text: 'if (true)', x: '75%', y: '60%', size: 11, delay: 1.5 },
  { text: 'function()', x: '5%', y: '70%', size: 12, delay: 2 },
  { text: 'for i in', x: '90%', y: '80%', size: 11, delay: 0.4 },
  { text: '{ }', x: '15%', y: '85%', size: 18, delay: 1.2 },
  { text: 'import', x: '60%', y: '8%', size: 12, delay: 1.8 },
  { text: 'return', x: '30%', y: '90%', size: 11, delay: 0.6 },
]

const stats = [
  { icon: <BookOpen className="w-5 h-5" />, value: '10+', label: 'Course Tersedia' },
  { icon: <Zap className="w-5 h-5" />, value: '⚡', label: 'Generate Instan' },
  { icon: <CheckCircle className="w-5 h-5" />, value: '100%', label: 'Gratis Digunakan' },
]

const steps = [
  { n: '01', title: 'Isi Data Murid', desc: 'Masukkan nama murid, pilih course dan lesson yang dipelajari hari ini' },
  { n: '02', title: 'Generate Report', desc: 'Klik tombol Generate dan laporan akan dibuat secara otomatis dalam hitungan detik' },
  { n: '03', title: 'Kirim ke Orang Tua', desc: 'Copy teks atau langsung kirim via WhatsApp ke orang tua murid' },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ── HERO SECTION ── */}
      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f13 0%, #111111 50%, #0a1a10 100%)' }}
      >
        <VantaGlobe />

        {/* Green grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(45,197,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,197,110,0.07) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Floating code particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {codeParticles.map((p, i) => (
            <div
              key={i}
              className="absolute font-mono font-bold select-none"
              style={{
                left: p.x, top: p.y, fontSize: p.size,
                color: 'rgba(255,255,255,0.15)',
                animation: `floatUp ${3 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.text}
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50 pointer-events-none" />

        {/* Nav */}
        <nav
          className="relative z-10 flex items-center justify-between px-10 h-16 border-b"
          style={{ borderColor: 'rgba(45,197,110,0.15)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize/timedooracademy.com/wp-content/uploads/2022/09/timedoor-academy-2022-white-only.svg"
            alt="Timedoor Academy"
            style={{ height: 28, width: 'auto' }}
          />
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: 'rgba(45,197,110,0.15)', border: '1px solid rgba(45,197,110,0.3)' }}
          >
            <FileText className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-white/85">Report Generator</span>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2"
              style={{ background: 'rgba(45,197,110,0.15)', border: '1px solid rgba(45,197,110,0.35)' }}
            >
              <span
                className="w-2 h-2 rounded-full block"
                style={{ background: '#2dc56e', boxShadow: '0 0 8px #2dc56e' }}
              />
              <span className="text-sm font-semibold tracking-widest text-white/80 uppercase">
                Timedoor Coding Academy
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.03em' }}
          >
            Report{' '}
            <span style={{ color: '#2dc56e', textShadow: '0 0 40px rgba(45,197,110,0.5)' }}>
              Generator
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg max-w-md mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Buat laporan pembelajaran murid dengan cepat dan mudah.
            Pilih course, lesson, dan kirim langsung ke orang tua via WhatsApp.
          </motion.p>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {['✨ Generate Otomatis', '📋 Copy Teks', '💬 Kirim via WhatsApp', '👥 Multi Murid'].map((f) => (
              <span
                key={f}
                className="text-sm font-semibold px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {f}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link href="/generator">
              <button
                className="inline-flex items-center gap-3 font-bold text-white rounded-xl px-10 py-4 text-lg transition-all"
                style={{
                  background: '#2dc56e',
                  boxShadow: '0 8px 32px rgba(45,197,110,0.45)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 0 0 6px rgba(45,197,110,0.15), 0 12px 40px rgba(45,197,110,0.55)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(45,197,110,0.45)'
                }}
              >
                <FileText className="w-5 h-5" />
                Buat Report Sekarang
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ width: '100%', height: 64, display: 'block' }}>
            <path d="M0,64 C360,10 1080,56 1440,16 L1440,64 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ── STATS + STEPS SECTION ── */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Stats */}
          <div className="flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-14">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex-1 text-center py-7 px-5"
                style={{ borderRight: i < 2 ? '1px solid #f3f4f6' : 'none' }}
              >
                <div className="flex justify-center mb-2" style={{ color: '#2dc56e' }}>{s.icon}</div>
                <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Cara Penggunaan</h2>
            <p className="text-sm text-gray-500">3 langkah mudah untuk kirim laporan</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <div
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-extrabold mb-3"
                  style={{ background: 'rgba(45,197,110,0.12)', color: '#16a34a' }}
                >
                  {step.n}
                </div>
                <div className="font-bold text-gray-900 mb-2">{step.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
