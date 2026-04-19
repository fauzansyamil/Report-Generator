declare module 'vanta/dist/vanta.globe.min' {
  const GLOBE: (options: Record<string, unknown>) => { destroy: () => void }
  export default GLOBE
}
