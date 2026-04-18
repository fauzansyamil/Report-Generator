'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ReportOutputProps {
  report: string
}

export default function ReportOutput({ report }: ReportOutputProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(report)
    toast.success('Report berhasil disalin!')
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(report)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={report}
        readOnly
        className="min-h-[400px] font-mono text-sm resize-none bg-gray-50"
      />
      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline" className="flex-1">
          <Copy className="w-4 h-4 mr-2" />
          Copy Teks
        </Button>
        <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          Kirim via WhatsApp
        </Button>
      </div>
    </div>
  )
}
