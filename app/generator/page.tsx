'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import StudentCard from '@/components/StudentCard'
import ReportOutput from '@/components/ReportOutput'
import DarkBackground from '@/components/DarkBackground'
import { StudentEntry } from '@/lib/types'
import { generateReport } from '@/lib/generateReport'
import { supabase } from '@/lib/supabase'
import { Plus, FileText, Settings, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

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
          const { data: courseData } = await supabase
            .from('courses')
            .select('name')
            .eq('id', s.courseId)
            .single()

          const { data: lessonData } = await supabase
            .from('lessons')
            .select('number, title')
            .eq('id', s.lessonId)
            .single()

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
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h1 className="font-bold text-base text-white">Report Generator</h1>
            <span className="text-xs text-slate-500 hidden sm:inline">Timedoor Coding</span>
          </div>
        </div>
        <Link href="/admin">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
          >
            <Settings className="w-4 h-4 mr-1" /> Kelola Course
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
                variant="outline"
                size="sm"
                onClick={addStudent}
                className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
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
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
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
              <div className="bg-white/5 backdrop-blur-md border border-white/10 border-dashed rounded-2xl h-64 flex items-center justify-center">
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
