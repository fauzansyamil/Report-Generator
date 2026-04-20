export const dynamic = 'force-dynamic'

import CourseManager from '@/components/admin/CourseManager'
import DarkBackground from '@/components/DarkBackground'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="relative min-h-screen text-white">
      <DarkBackground />

      <header
        className="relative z-10 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center gap-4"
        style={{ background: 'rgba(13,31,19,0.95)' }}
      >
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize/timedooracademy.com/wp-content/uploads/2022/09/timedoor-academy-2022-white-only.svg"
            alt="Timedoor Academy"
            style={{ height: 26, width: 'auto' }}
          />
        </Link>
        <div className="w-px h-4 bg-white/15" />
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ background: 'rgba(45,197,110,0.15)', border: '1px solid rgba(45,197,110,0.3)' }}
        >
          <BookOpen className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-semibold text-white/85">Kelola Data Course</span>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <CourseManager />
      </main>
    </div>
  )
}
