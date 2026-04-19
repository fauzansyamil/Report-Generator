'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import StudentCard from '@/components/StudentCard'
import ReportOutput from '@/components/ReportOutput'
import { StudentEntry } from '@/lib/types'
import { generateReport } from '@/lib/generateReport'
import { supabase } from '@/lib/supabase'
import { Plus, FileText, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

function generateId() {
  return Math.random().toString(36).slice(2)
}

function emptyStudent(): StudentEntry {
  return { id: generateId(), name: '', courseId: '', lessonId: '', topics: [] }
}

export default function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <FileText className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-lg">Report Generator</h1>
          <span className="text-xs text-gray-400 hidden sm:inline">Timedoor Coding</span>
        </div>
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" /> Kelola Course
          </Button>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Data Murid</h2>
              <Button variant="outline" size="sm" onClick={addStudent}>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Report'}
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Preview Report</h2>
            {report ? (
              <ReportOutput report={report} />
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400 bg-white">
                <div className="text-center">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Report akan muncul di sini</p>
                  <p className="text-sm">Isi data murid lalu klik Generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
