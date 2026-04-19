'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Trash2, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Course, Lesson, Topic, StudentEntry } from '@/lib/types'

interface StudentCardProps {
  student: StudentEntry
  index: number
  onChange: (updated: StudentEntry) => void
  onRemove: () => void
}

export default function StudentCard({ student, index, onChange, onRemove }: StudentCardProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    supabase.from('courses').select('*').order('name').then(({ data }) => {
      if (data) setCourses(data)
    })
  }, [])

  useEffect(() => {
    if (!student.courseId) { setLessons([]); return }
    supabase.from('lessons').select('*').eq('course_id', student.courseId).order('number')
      .then(({ data }) => { if (data) setLessons(data) })
  }, [student.courseId])

  const handleCourseChange = (courseId: string | null) => {
    onChange({ ...student, courseId: courseId ?? '', lessonId: '', topics: [] })
  }

  const handleLessonChange = async (lessonId: string | null) => {
    if (!lessonId) return
    const { data } = await supabase.from('topics').select('*').eq('lesson_id', lessonId).order('order_index')
    onChange({ ...student, lessonId, topics: data ? data.map((t: Topic) => t.text) : [] })
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">Murid {index + 1}</span>
          {student.name && (
            <span className="text-sm font-semibold text-white">— {student.name}</span>
          )}
        </div>
        <button onClick={onRemove} className="text-slate-500 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-4">
        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Nama Murid</Label>
          <Input
            placeholder="Contoh: Morgan"
            value={student.name}
            onChange={(e) => onChange({ ...student, name: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Course</Label>
          <Select value={student.courseId} onValueChange={handleCourseChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Pilih course..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-slate-200 focus:bg-white/10 focus:text-white">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {student.courseId && (
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Lesson</Label>
            <Select value={student.lessonId} onValueChange={handleLessonChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Pilih lesson..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id} className="text-slate-200 focus:bg-white/10 focus:text-white">
                    Lesson {l.number} - {l.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {student.topics.length > 0 && (
          <div>
            <Label className="text-slate-400 text-xs mb-1.5 block">Topik yang dipelajari</Label>
            <div className="space-y-1.5">
              {student.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="flex-1 text-sm text-slate-200">{topic}</span>
                  <button
                    onClick={() => onChange({ ...student, topics: student.topics.filter((_, idx) => idx !== i) })}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
