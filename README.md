# 📋 Report Generator - Timedoor Coding

Web app untuk mempermudah pembuatan laporan pembelajaran murid setelah setiap sesi kelas coding.

## ✨ Fitur

- **Generate report otomatis** — pilih murid, course, dan lesson, topik langsung muncul otomatis
- **Multi murid** — bisa generate report untuk beberapa murid sekaligus dalam satu sesi
- **Copy teks** — salin laporan dengan satu klik
- **Kirim via WhatsApp** — buka WhatsApp langsung dengan teks laporan yang sudah terisi
- **Halaman Admin** — kelola data course, lesson, dan topik tanpa perlu edit kode

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) — Framework React
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — Komponen UI
- [Supabase](https://supabase.com/) — Database (PostgreSQL)
- [Vercel](https://vercel.com/) — Deployment

## 🗄️ Database Schema

```
courses     → id, name
lessons     → id, course_id, number, title
topics      → id, lesson_id, text, order_index
```

## 🚀 Cara Pakai

### 1. Clone repo
```bash
git clone https://github.com/fauzansyamil/Report-Generator.git
cd Report-Generator
npm install
```

### 2. Setup environment variables
Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup database Supabase
Jalankan SQL berikut di Supabase SQL Editor:
```sql
create table courses (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default now()
);

create table lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade,
  number integer not null,
  title text not null,
  created_at timestamp with time zone default now()
);

create table topics (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references lessons(id) on delete cascade,
  text text not null,
  order_index integer not null default 0,
  created_at timestamp with time zone default now()
);
```

### 4. Jalankan development server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Isi data course
Buka `/admin` untuk menambahkan data course, lesson, dan topik sebelum mulai generate report.

## 📦 Deploy ke Vercel

1. Push ke GitHub
2. Import repo di [vercel.com](https://vercel.com)
3. Tambahkan environment variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!
