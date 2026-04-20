export default function DarkBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1f13 0%, #111111 50%, #0a1a10 100%)' }}
    >
      {/* Green grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(45,197,110,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,197,110,0.07) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Top-right glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120, right: -80, width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(45,197,110,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Bottom-left glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -100, left: -60, width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(45,197,110,0.10) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
