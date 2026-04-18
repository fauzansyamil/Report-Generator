interface ReportStudent {
  name: string
  courseName: string
  lessonNumber: number
  lessonTitle: string
  topics: string[]
}

export function generateReport(students: ReportStudent[]): string {
  if (students.length === 0) return ''

  const names = students.map((s) => s.name).join(', ')
  const pronoun = students.length === 1 ? 'Dia' : 'Mereka'

  const header = `Hello, Parents! 👋
Terima kasih atas kehadiran dan partisipasi ${names} dalam kelas kali ini. ${pronoun} menunjukkan fokus dan perkembangan yang baik selama proses pembelajaran hari ini:`

  const body = students
    .map((s) => {
      const topicList = s.topics.map((t) => `- ${t}`).join('\n')
      return `Progres belajar ${s.name} saat ini sudah mencapai:

📘 ${s.courseName}:
Lesson ${s.lessonNumber} - ${s.lessonTitle}
${topicList}`
    })
    .join('\n\n')

  const footer = `Mohon pengertian apabila dalam proses pembelajaran masih terdapat hal yang perlu ditingkatkan. Saya akan terus melakukan evaluasi agar sesi kelas berikutnya dapat berjalan lebih optimal 🌱

Anak-anak mengikuti pembelajaran dengan baik hari ini dan menunjukkan perkembangan yang positif. Semoga pengalaman belajar ini dapat terus meningkatkan pemahaman dan kepercayaan diri mereka 😊👋🏻`

  return `${header}\n\n${body}\n\n${footer}`
}
