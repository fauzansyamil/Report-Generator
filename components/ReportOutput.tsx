'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, MessageCircle, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface ReportOutputProps {
  report: string
}

export default function ReportOutput({ report }: ReportOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report)
    toast.success('Report berhasil disalin!')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(report)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={report}
          readOnly
          className="min-h-[400px] font-mono text-sm resize-none bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-blue-500/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
        >
          {copied ? <CheckCheck className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Tersalin!' : 'Copy Teks'}
        </Button>
        <Button
          onClick={handleWhatsApp}
          className="flex-1 bg-green-600/80 hover:bg-green-500/80 text-white border border-green-500/30 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-green-500/20"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Kirim via WhatsApp
        </Button>
      </div>
    </div>
  )
}
