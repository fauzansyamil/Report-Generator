'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Trash2, User, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Course, Lesson, Topic, StudentEntry } from '@/lib/types'
import { toast } from 'sonner'

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
    supabase.from('courses').select('*').order('name').then(({ data, error }) => {
      if (error || !data) {
        toast.error('Gagal memuat daftar course. Cek koneksi internet / disable extension.')
        return
      }
      setCourses(data)
    }).catch(() => {
      toast.error('Tidak bisa konek ke Supabase. Cek koneksi / browser extension.')
    })
  }, [])

  useEffect(() => {
    if (!student.courseId) { setLessons([]); return }
    supabase.from('lessons').select('*').eq('course_id', student.courseId).order('number')
      .then(({ data }) => { if (data) setLessons(data) })
  }, [student.courseId])

  const handleCourseChange = (courseId: string | null) => {
    onChange({ ...student, courseId: courseId ?? '', lessons: [{ lessonId: '', topics: [] }] })
  }

  const handleLessonChange = async (lessonIndex: number, lessonId: string | null) => {
    if (!lessonId) return
    const { data } = await supabase.from('topics').select('*').eq('lesson_id', lessonId).order('order_index')
    const topics = data ? data.map((t: Topic) => t.text) : []
    const updatedLessons = student.lessons.map((l, i) =>
      i === lessonIndex ? { lessonId, topics } : l
    )
    onChange({ ...student, lessons: updatedLessons })
  }

  const addLesson = () => {
    if (student.lessons.length >= 3) return
    onChange({ ...student, lessons: [...student.lessons, { lessonId: '', topics: [] }] })
  }

  const removeLesson = (lessonIndex: number) => {
    if (student.lessons.length <= 1) return
    onChange({ ...student, lessons: student.lessons.filter((_, i) => i !== lessonIndex) })
  }

  const removeTopic = (lessonIndex: number, topicIndex: number) => {
    const updatedLessons = student.lessons.map((l, i) =>
      i === lessonIndex ? { ...l, topics: l.topics.filter((_, idx) => idx !== topicIndex) } : l
    )
    onChange({ ...student, lessons: updatedLessons })
  }

  const usedLessonIds = student.lessons.map((l) => l.lessonId).filter(Boolean)

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-green-400" />
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
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-green-500/50 focus:ring-green-500/20"
          />
        </div>

        <div>
          <Label className="text-slate-400 text-xs mb-1.5 block">Course</Label>
          <Select value={student.courseId || undefined} onValueChange={handleCourseChange}>
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
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
          <div className="space-y-3">
            {student.lessons.map((lessonEntry, lessonIndex) => (
              <div key={lessonIndex} className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-slate-400 text-xs mb-1.5 block">
                      Lesson {lessonIndex + 1}
                    </Label>
                    <Select
                      value={lessonEntry.lessonId || undefined}
                      onValueChange={(val) => handleLessonChange(lessonIndex, val)}
                    >
                      <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Pilih lesson..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {lessons
                          .filter((l) => !usedLessonIds.includes(l.id) || l.id === lessonEntry.lessonId)
                          .map((l) => (
                            <SelectItem key={l.id} value={l.id} className="text-slate-200 focus:bg-white/10 focus:text-white">
                              Lesson {l.number} - {l.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {student.lessons.length > 1 && (
                    <button
                      onClick={() => removeLesson(lessonIndex)}
                      className="mt-5 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {lessonEntry.topics.length > 0 && (
                  <div className="space-y-1.5">
                    {lessonEntry.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                        <span className="flex-1 text-sm text-slate-200">{topic}</span>
                        <button
                          onClick={() => removeTopic(lessonIndex, topicIdx)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {student.lessons.length < 3 && (
              <button
                onClick={addLesson}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all"
                style={{ background: 'rgba(45,197,110,0.08)', border: '1px dashed rgba(45,197,110,0.3)', color: 'rgba(45,197,110,0.8)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Lesson
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
