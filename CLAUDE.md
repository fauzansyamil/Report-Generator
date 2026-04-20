@AGENTS.md

# Report Generator — Timedoor Coding Academy

Aplikasi web untuk guru Timedoor membuat laporan pembelajaran murid, lalu dikirim ke orang tua via WhatsApp.

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Supabase** (PostgreSQL) — data courses, lessons, topics
- **Framer Motion** — animasi landing page
- **Vanta.js + Three.js** — animasi globe 3D di landing page
- **Sonner** — toast notifications
- Deploy di **Vercel**, repo di GitHub: `fauzansyamil/Report-Generator`

## Struktur Halaman
- `/` — Landing page (Vanta globe, stats, cara penggunaan)
- `/generator` — Halaman utama generate report
- `/admin` — Kelola data course, lesson, topik

## Database Supabase
- `courses` — id, name
- `lessons` — id, course_id, number, title
- `topics` — id, lesson_id, text, order_index

Supabase URL: `https://wsgpqoujgkodpcqkhosj.supabase.co`
Env vars ada di `.env.local` dan di Vercel dashboard.

## Design System
- **Warna aksen: hijau** `#2DC56E` — gunakan `green-500`/`green-400`/`green-600` di Tailwind
- **Background**: dark green-black gradient `linear-gradient(135deg, #0d1f13 0%, #111111 50%, #0a1a10 100%)`
- **Grid overlay**: green tinted lines, `rgba(45,197,110,0.07)`, 48px spacing
- **Glassmorphism**: `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl`
- **Input dark**: `bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-green-500/50`
- **SelectContent**: `bg-slate-900 border-white/10`
- **Timedoor logo** (putih, untuk background gelap): `https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize/timedooracademy.com/wp-content/uploads/2022/09/timedoor-academy-2022-white-only.svg`
- Logo di-render pakai `<img>` biasa (bukan Next.js Image) agar tidak perlu config domain

## Komponen Penting
- `components/DarkBackground.tsx` — background gelap dengan green glow + grid lines, dipakai di `/generator` dan `/admin`
- `components/VantaGlobe.tsx` — globe 3D, hanya di landing page
- `components/StudentCard.tsx` — card input data murid (nama, course, lesson, topics)
- `components/ReportOutput.tsx` — preview report + tombol copy & WhatsApp
- `components/admin/CourseManager.tsx` — CRUD course/lesson/topik

## Scraper LMS
- Lokasi: `C:\Users\syemm\Timedoor\scraper\scrape.js`
- Scrape data dari `https://cms.timedooracademy.com/tms`
- Login: username & password = `TCR20251022327`
- Ambil courses → books → lessons → topics (format `objective`)
- Simpan langsung ke Supabase
- Jalankan: `node "C:/Users/syemm/Timedoor/scraper/scrape.js"`

## Aturan Penting
- Jangan ganti warna aksen dari hijau ke warna lain tanpa diminta
- Semua halaman pakai dark theme — jangan tambah halaman putih/light kecuali diminta
- `app/admin/page.tsx` harus selalu punya `export const dynamic = 'force-dynamic'` di baris pertama
- Gunakan `lib/supabase.ts` dengan `?? ''` fallback agar tidak crash saat build di Vercel
