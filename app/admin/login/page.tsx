'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DarkBackground from '@/components/DarkBackground'
import { Lock, Eye, EyeOff, BookOpen } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Password salah. Coba lagi.')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center">
      <DarkBackground />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize/timedooracademy.com/wp-content/uploads/2022/09/timedoor-academy-2022-white-only.svg"
            alt="Timedoor Academy"
            style={{ height: 32, width: 'auto' }}
          />
        </div>

        {/* Card */}
        <div
          className="backdrop-blur-md rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(45,197,110,0.15)', border: '1px solid rgba(45,197,110,0.3)' }}
            >
              <BookOpen className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">Admin Area</h1>
              <p className="text-xs text-white/50">Masukkan password untuk akses</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl pl-10 pr-10 py-3 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                }}
                onFocus={(e) => {
                  if (!error) e.currentTarget.style.border = '1px solid rgba(45,197,110,0.5)'
                }}
                onBlur={(e) => {
                  if (!error) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              style={{
                backgroundColor: '#16a34a',
                boxShadow: '0 4px 20px rgba(45,197,110,0.35)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
