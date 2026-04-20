'use client'

import { useEffect, useRef } from 'react'

export default function VantaGlobe() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    const loadVanta = async () => {
      const THREE = await import('three')
      const GLOBE = (await import('vanta/dist/vanta.globe.min')).default

      if (vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = GLOBE({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x2dc56e,
          color2: 0x16a34a,
          backgroundColor: 0x0d1f13,
          size: 1.2,
        })
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return <div ref={vantaRef} className="absolute inset-0 w-full h-full" />
}
