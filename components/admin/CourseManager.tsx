'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Course, Lesson, Topic } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, ChevronDown, BookOpen, GraduationCap } from 'lucide-react'
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

  useEffect(() => { fetchCourses() }, [])

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
    if (expandedCourse === courseId) { setExpandedCourse(null); return }
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
      course_id: courseId, number: parseInt(l.number), title: l.title.trim(),
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
    if (expandedLesson === lessonId) { setExpandedLesson(null); return }
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
      lesson_id: lessonId, text: text.trim(), order_index: existingTopics.length,
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
      {/* Add Course */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-green-500/20 border border-green-400/30 flex items-center justify-center">
            <Plus className="w-3 h-3 text-green-400" />
          </div>
          <h2 className="text-sm font-medium text-slate-300">Tambah Course Baru</h2>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Nama course, contoh: Python Artificial Intelligence"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCourse()}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-green-500/50 focus:ring-green-500/20"
          />
          <Button onClick={addCourse} className="bg-green-600 hover:bg-green-500 text-white border-0 shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Tambah
          </Button>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => toggleCourse(course.id)}
            >
              <div className="flex items-center gap-2.5">
                <div className={`transition-transform duration-200 ${expandedCourse === course.id ? 'rotate-0' : '-rotate-90'}`}>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <div className="w-6 h-6 rounded-md bg-green-500/20 border border-green-400/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3 h-3 text-green-400" />
                </div>
                <span className="font-medium text-slate-200 text-sm">{course.name}</span>
              </div>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                onClick={(e) => { e.stopPropagation(); deleteCourse(course.id) }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {expandedCourse === course.id && (
              <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="No." type="number"
                    className="w-20 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-green-500/50 text-sm h-9"
                    value={newLesson[course.id]?.number || ''}
                    onChange={(e) => setNewLesson((prev) => ({ ...prev, [course.id]: { ...prev[course.id], number: e.target.value } }))}
                  />
                  <Input
                    placeholder="Judul lesson"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-green-500/50 text-sm h-9"
                    value={newLesson[course.id]?.title || ''}
                    onChange={(e) => setNewLesson((prev) => ({ ...prev, [course.id]: { ...prev[course.id], title: e.target.value } }))}
                    onKeyDown={(e) => e.key === 'Enter' && addLesson(course.id)}
                  />
                  <Button
                    size="sm" className="h-9 bg-green-600/70 hover:bg-green-500/70 text-white border border-green-500/30 shrink-0"
                    onClick={() => addLesson(course.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Lesson
                  </Button>
                </div>

                <div className="space-y-2">
                  {(lessons[course.id] || []).map((lesson) => (
                    <div key={lesson.id} className="border border-white/10 rounded-xl overflow-hidden">
                      <div
                        className="flex items-center justify-between px-3 py-2.5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => toggleLesson(lesson.id)}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`transition-transform duration-200 ${expandedLesson === lesson.id ? 'rotate-0' : '-rotate-90'}`}>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          </div>
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-300">Lesson {lesson.number}</span>
                          <span className="text-slate-500">—</span>
                          <span className="text-slate-400">{lesson.title}</span>
                        </div>
                        <Button
                          variant="ghost" size="icon"
                          className="h-6 w-6 text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id, course.id) }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {expandedLesson === lesson.id && (
                        <div className="px-3 py-2.5 space-y-2 bg-black/20">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Tambah topik..."
                              className="text-sm h-8 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-green-500/50"
                              value={newTopic[lesson.id] || ''}
                              onChange={(e) => setNewTopic((prev) => ({ ...prev, [lesson.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && addTopic(lesson.id)}
                            />
                            <Button
                              size="sm" className="h-8 w-8 p-0 bg-green-600/50 hover:bg-green-500/50 text-white border border-green-500/30"
                              onClick={() => addTopic(lesson.id)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          {(topics[lesson.id] || []).map((topic) => (
                            <div key={topic.id} className="flex items-center gap-2 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                              <span className="flex-1 text-slate-300">{topic.text}</span>
                              <button
                                onClick={() => deleteTopic(topic.id, lesson.id)}
                                className="text-slate-600 hover:text-red-400 transition-colors"
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
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Belum ada course. Tambah course di atas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
