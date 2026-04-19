export const dynamic = 'force-dynamic'

import CourseManager from '@/components/admin/CourseManager'
import DarkBackground from '@/components/DarkBackground'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="relative min-h-screen text-white">
      <DarkBackground />

      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <h1 className="font-bold text-base text-white">Kelola Data Course</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <CourseManager />
      </main>
    </div>
  )
}
