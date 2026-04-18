export interface Course {
  id: string
  name: string
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  number: number
  title: string
  created_at: string
}

export interface Topic {
  id: string
  lesson_id: string
  text: string
  order_index: number
  created_at: string
}

export interface StudentEntry {
  id: string
  name: string
  courseId: string
  lessonId: string
  topics: string[]
}
