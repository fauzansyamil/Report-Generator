export const dynamic = 'force-dynamic'

import CourseManager from '@/components/admin/CourseManager'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-lg">Kelola Data Course</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <CourseManager />
      </main>
    </div>
  )
}
