'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Course, Lesson, Topic } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourseName, setNewCourseName] = useState('')
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({})
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [topics, setTopics] = useState<Record<string, Topic[]>>({})
  const [newLesson, setNewLesson] = useState<Record<string, { number: string; title: string }>>({})
  const [newTopic, setNewTopic] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('name')
    if (data) setCourses(data)
  }

  const addCourse = async () => {
    if (!newCourseName.trim()) return
    const { error } = await supabase.from('courses').insert({ name: newCourseName.trim() })
    if (error) { toast.error('Gagal menambah course'); return }
    toast.success('Course berhasil ditambah!')
    setNewCourseName('')
    fetchCourses()
  }

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus course'); return }
    toast.success('Course dihapus')
    fetchCourses()
  }

  const toggleCourse = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null)
      return
    }
    setExpandedCourse(courseId)
    if (!lessons[courseId]) {
      const { data } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('number')
      if (data) setLessons((prev) => ({ ...prev, [courseId]: data }))
    }
  }

  const addLesson = async (courseId: string) => {
    const l = newLesson[courseId]
    if (!l?.number || !l?.title) return
    const { error } = await supabase.from('lessons').insert({
      course_id: courseId,
      number: parseInt(l.number),
      title: l.title.trim(),
    })
    if (error) { toast.error('Gagal menambah lesson'); return }
    toast.success('Lesson berhasil ditambah!')
    setNewLesson((prev) => ({ ...prev, [courseId]: { number: '', title: '' } }))
    const { data } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('number')
    if (data) setLessons((prev) => ({ ...prev, [courseId]: data }))
  }

  const deleteLesson = async (lessonId: string, courseId: string) => {
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId)
    if (error) { toast.error('Gagal menghapus lesson'); return }
    toast.success('Lesson dihapus')
    const { data } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('number')
    if (data) setLessons((prev) => ({ ...prev, [courseId]: data }))
  }

  const toggleLesson = async (lessonId: string) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null)
      return
    }
    setExpandedLesson(lessonId)
    if (!topics[lessonId]) {
      const { data } = await supabase.from('topics').select('*').eq('lesson_id', lessonId).order('order_index')
      if (data) setTopics((prev) => ({ ...prev, [lessonId]: data }))
    }
  }

  const addTopic = async (lessonId: string) => {
    const text = newTopic[lessonId]
    if (!text?.trim()) return
    const existingTopics = topics[lessonId] || []
    const { error } = await supabase.from('topics').insert({
      lesson_id: lessonId,
      text: text.trim(),
      order_index: existingTopics.length,
    })
    if (error) { toast.error('Gagal menambah topik'); return }
    toast.success('Topik berhasil ditambah!')
    setNewTopic((prev) => ({ ...prev, [lessonId]: '' }))
    const { data } = await supabase.from('topics').select('*').eq('lesson_id', lessonId).order('order_index')
    if (data) setTopics((prev) => ({ ...prev, [lessonId]: data }))
  }

  const deleteTopic = async (topicId: string, lessonId: string) => {
    const { error } = await supabase.from('topics').delete().eq('id', topicId)
    if (error) { toast.error('Gagal menghapus topik'); return }
    toast.success('Topik dihapus')
    const { data } = await supabase.from('topics').select('*').eq('lesson_id', lessonId).order('order_index')
    if (data) setTopics((prev) => ({ ...prev, [lessonId]: data }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tambah Course Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nama course, contoh: Python Artificial Intelligence"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCourse()}
            />
            <Button onClick={addCourse}>
              <Plus className="w-4 h-4 mr-1" /> Tambah
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCourse(course.id)}
            >
              <div className="flex items-center gap-2">
                {expandedCourse === course.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="font-medium">📘 {course.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-600"
                onClick={(e) => { e.stopPropagation(); deleteCourse(course.id) }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {expandedCourse === course.id && (
              <div className="border-t px-4 pb-4 pt-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="No."
                    type="number"
                    className="w-20"
                    value={newLesson[course.id]?.number || ''}
                    onChange={(e) => setNewLesson((prev) => ({ ...prev, [course.id]: { ...prev[course.id], number: e.target.value } }))}
                  />
                  <Input
                    placeholder="Judul lesson"
                    value={newLesson[course.id]?.title || ''}
                    onChange={(e) => setNewLesson((prev) => ({ ...prev, [course.id]: { ...prev[course.id], title: e.target.value } }))}
                    onKeyDown={(e) => e.key === 'Enter' && addLesson(course.id)}
                  />
                  <Button size="sm" onClick={() => addLesson(course.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Lesson
                  </Button>
                </div>

                <div className="space-y-2">
                  {(lessons[course.id] || []).map((lesson) => (
                    <div key={lesson.id} className="border rounded-lg overflow-hidden">
                      <div
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleLesson(lesson.id)}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {expandedLesson === lesson.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          <span className="font-medium">Lesson {lesson.number}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>{lesson.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-400 hover:text-red-600"
                          onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id, course.id) }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {expandedLesson === lesson.id && (
                        <div className="px-3 py-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Tambah topik..."
                              className="text-sm h-8"
                              value={newTopic[lesson.id] || ''}
                              onChange={(e) => setNewTopic((prev) => ({ ...prev, [lesson.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && addTopic(lesson.id)}
                            />
                            <Button size="sm" className="h-8" onClick={() => addTopic(lesson.id)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          {(topics[lesson.id] || []).map((topic) => (
                            <div key={topic.id} className="flex items-center gap-2 text-sm bg-blue-50 rounded px-2 py-1">
                              <span className="flex-1">- {topic.text}</span>
                              <button
                                onClick={() => deleteTopic(topic.id, lesson.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {courses.length === 0 && (
          <p className="text-center text-gray-400 py-8">Belum ada course. Tambah course di atas.</p>
        )}
      </div>
    </div>
  )
}
