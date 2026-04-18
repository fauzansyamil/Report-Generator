'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Trash2 } from 'lucide-react'
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
    if (!student.courseId) {
      setLessons([])
      return
    }
    supabase
      .from('lessons')
      .select('*')
      .eq('course_id', student.courseId)
      .order('number')
      .then(({ data }) => {
        if (data) setLessons(data)
      })
  }, [student.courseId])

  const handleCourseChange = (courseId: string | null) => {
    onChange({ ...student, courseId: courseId ?? '', lessonId: '', topics: [] })
  }

  const handleLessonChange = async (lessonId: string | null) => {
    if (!lessonId) return
    const { data } = await supabase
      .from('topics')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index')

    onChange({
      ...student,
      lessonId,
      topics: data ? data.map((t: Topic) => t.text) : [],
    })
  }

  const selectedLesson = lessons.find((l) => l.id === student.lessonId)

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Murid {index + 1}</Badge>
          {student.name && <span className="font-semibold text-sm">{student.name}</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} className="text-red-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Nama Murid</Label>
          <Input
            placeholder="Contoh: Morgan"
            value={student.name}
            onChange={(e) => onChange({ ...student, name: e.target.value })}
          />
        </div>

        <div>
          <Label>Course</Label>
          <Select value={student.courseId} onValueChange={handleCourseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {student.courseId && (
          <div>
            <Label>Lesson</Label>
            <Select value={student.lessonId} onValueChange={handleLessonChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih lesson..." />
              </SelectTrigger>
              <SelectContent>
                {lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    Lesson {l.number} - {l.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {student.topics.length > 0 && (
          <div>
            <Label>Topik yang dipelajari</Label>
            <div className="space-y-2 mt-1">
              {student.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 bg-blue-50 rounded px-3 py-2 text-sm">
                  <span className="flex-1">{topic}</span>
                  <button
                    onClick={() => {
                      const updated = student.topics.filter((_, idx) => idx !== i)
                      onChange({ ...student, topics: updated })
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
