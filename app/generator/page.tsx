'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import StudentCard from '@/components/StudentCard'
import ReportOutput from '@/components/ReportOutput'
import DarkBackground from '@/components/DarkBackground'
import { StudentEntry } from '@/lib/types'
import { generateReport } from '@/lib/generateReport'
import { supabase } from '@/lib/supabase'
import { Settings, Sparkles, FileText } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

function generateId() {
  return Math.random().toString(36).slice(2)
}

function emptyStudent(): StudentEntry {
  return { id: generateId(), name: '', courseId: '', lessonId: '', topics: [] }
}

export default function GeneratorPage() {
  const [students, setStudents] = useState<StudentEntry[]>([emptyStudent()])
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  const addStudent = () => setStudents((prev) => [...prev, emptyStudent()])

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  const updateStudent = (updated: StudentEntry) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  }

  const handleGenerate = async () => {
    const invalid = students.filter((s) => !s.name.trim() || !s.courseId || !s.lessonId)
    if (invalid.length > 0) {
      toast.error('Lengkapi nama, course, dan lesson untuk semua murid!')
      return
    }

    setLoading(true)
    try {
      const reportStudents = await Promise.all(
        students.map(async (s) => {
          const { data: courseData } = await supabase.from('courses').select('name').eq('id', s.courseId).single()
          const { data: lessonData } = await supabase.from('lessons').select('number, title').eq('id', s.lessonId).single()
          return {
            name: s.name,
            courseName: courseData?.name || '',
            lessonNumber: lessonData?.number || 0,
            lessonTitle: lessonData?.title || '',
            topics: s.topics,
          }
        })
      )
      setReport(generateReport(reportStudents))
    } catch {
      toast.error('Terjadi kesalahan saat generate report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen text-white">
      <DarkBackground />

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between"
        style={{ background: 'rgba(13,31,19,0.95)' }}>
        <div className="flex items-center gap-4">
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
            <FileText className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-semibold text-white/85">Report Generator</span>
          </div>
        </div>
        <Link href="/admin">
          <Button
            variant="outline" size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" /> Kelola Course
          </Button>
        </Link>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Student Data */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-200">Data Murid</h2>
              <Button
                variant="outline" size="sm" onClick={addStudent}
                className="text-green-400 hover:text-green-300 transition-all text-xs"
                style={{ background: 'rgba(45,197,110,0.12)', border: '1px solid rgba(45,197,110,0.3)' }}
              >
                <Plus className="w-4 h-4 mr-1" /> Tambah Murid
              </Button>
            </div>

            <div className="space-y-4">
              {students.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  index={index}
                  onChange={updateStudent}
                  onRemove={() => removeStudent(student.id)}
                />
              ))}
            </div>

            <Button
              className="w-full py-6 text-base rounded-xl font-bold transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: 'var(--tw-gradient-stops, #16a34a)',
                backgroundColor: '#16a34a',
                boxShadow: '0 4px 20px rgba(45,197,110,0.35)',
              }}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Report
                </span>
              )}
            </Button>
          </div>

          {/* Right: Report Preview */}
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-200">Preview Report</h2>
            {report ? (
              <ReportOutput report={report} />
            ) : (
              <div
                className="backdrop-blur-md rounded-2xl h-64 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)' }}
              >
                <div className="text-center text-slate-500">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Report akan muncul di sini</p>
                  <p className="text-xs mt-1 opacity-70">Isi data murid lalu klik Generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
