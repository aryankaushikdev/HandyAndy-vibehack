'use client'

// ─────────────────────────────────────────────────────────────────────────────
// 3D Viewer Placeholder
// Shows a professional anatomical wrist illustration in NHS Blue tones.
// This component is the Blender integration point.
//
// TO INTEGRATE YOUR BLENDER MODEL:
//   1. Export from Blender as .glb (File → Export → glTF 2.0, select Binary)
//   2. Place the .glb file in /public/models/recovery-model.glb
//   3. Replace this component with ThreeDCanvas.tsx (Three.js implementation)
//   4. The viewer controls (zoom, rotate, reset) are already wired for Three.js
// ─────────────────────────────────────────────────────────────────────────────

export default function ViewerPlaceholder() {
  return (
    <div
      className="viewer-placeholder relative border-2 border-gds-grey-mid overflow-hidden"
      style={{ aspectRatio: '1 / 1' }}
      aria-label="3D anatomical model viewer — Blender design will appear here"
      role="img"
    >
      {/* Anatomical grid background */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #0a1628 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: 'linear-gradient(rgba(0,94,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,94,184,0.08) 1px, transparent 1px)',
          backgroundSize:  '40px 40px',
        }}
      />

      {/* Anatomical SVG — right wrist illustration */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 220 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '65%', maxWidth: '200px', height: 'auto', opacity: 0.9 }}
        >
          {/* Forearm / wrist shaft */}
          <rect x="72" y="158" width="64" height="100" rx="10"
            fill="rgba(0,94,184,0.12)" stroke="#2255aa" strokeWidth="1.5" strokeDasharray="6 3" />
          <rect x="78" y="164" width="52" height="88" rx="8"
            fill="rgba(0,94,184,0.18)" stroke="#4488cc" strokeWidth="1.5" />

          {/* Wrist indicator ring */}
          <ellipse cx="109" cy="158" rx="36" ry="8"
            stroke="#FFDD00" strokeWidth="1.5" fill="none" opacity="0.6" strokeDasharray="4 3" />

          {/* Carpal bones row 1 */}
          {[[76,136,20,14],[100,136,20,14],[124,136,18,14]].map(([x,y,w,h], i) => (
            <rect key={`c1-${i}`} x={x} y={y} width={w} height={h} rx="3"
              fill="rgba(0,94,184,0.25)" stroke="#4488dd" strokeWidth="1.5" />
          ))}
          {/* Carpal bones row 2 */}
          {[[78,120,19,14],[100,120,19,14],[122,120,18,14]].map(([x,y,w,h], i) => (
            <rect key={`c2-${i}`} x={x} y={y} width={w} height={h} rx="3"
              fill="rgba(0,94,184,0.2)" stroke="#3366cc" strokeWidth="1.5" />
          ))}

          {/* Metacarpals (5 shafts) */}
          {[72,87,102,117,132].map((x, i) => (
            <rect key={`m-${i}`} x={x} y={76} width={11} height={42} rx="3"
              fill="rgba(80,160,255,0.18)" stroke="#5599ee" strokeWidth="1.5" />
          ))}

          {/* Fingers — 3 phalanges each */}
          {[72,87,102,117,132].map((x, i) => (
            <g key={`f-${i}`}>
              {/* Proximal */}
              <rect x={x} y={56} width={11} height={18} rx="2.5"
                fill="rgba(80,160,255,0.15)" stroke="#66aaff" strokeWidth="1.5" />
              {/* Middle */}
              <rect x={x+0.5} y={40} width={10} height={14} rx="2"
                fill="rgba(80,160,255,0.12)" stroke="#77bbff" strokeWidth="1.5" />
              {/* Distal / nail */}
              <rect x={x+1} y={27} width={9} height={11} rx="2"
                fill="rgba(80,160,255,0.1)" stroke="#88ccff" strokeWidth="1.2" />
              <rect x={x+2} y={28} width={5} height={6} rx="1"
                fill="rgba(80,160,255,0.08)" stroke="#99ddff" strokeWidth="0.8" />
            </g>
          ))}

          {/* Thumb — angled */}
          <g transform="translate(54,102) rotate(-28 6 14)">
            <rect x="0" y="0" width="13" height="30" rx="4.5"
              fill="rgba(80,160,255,0.18)" stroke="#66aaff" strokeWidth="1.5" />
            <rect x="1" y="-15" width="11" height="13" rx="3"
              fill="rgba(80,160,255,0.14)" stroke="#77bbff" strokeWidth="1.5" />
            <rect x="2" y="-27" width="9" height="10" rx="2.5"
              fill="rgba(80,160,255,0.1)" stroke="#88ccff" strokeWidth="1.2" />
          </g>

          {/* Ligament highlights — NHS Yellow */}
          <line x1="86" y1="134" x2="86" y2="118" stroke="#FFDD00" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 2"/>
          <line x1="110" y1="134" x2="110" y2="118" stroke="#FFDD00" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 2"/>
          <line x1="134" y1="134" x2="134" y2="118" stroke="#FFDD00" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 2"/>
          <line x1="76" y1="128" x2="140" y2="128" stroke="#FFDD00" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 2"/>

          {/* Range-of-motion arc */}
          <path d="M 72 110 Q 55 80 72 50" stroke="#FFDD00" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="3 2"/>
          <text x="44" y="82" fill="#FFDD00" fontSize="9" opacity="0.7">62°</text>

          {/* Scan highlight rings */}
          <circle cx="109" cy="128" r="44" stroke="#005EB8" strokeWidth="0.8" fill="none" opacity="0.2" strokeDasharray="4 4"/>
          <circle cx="109" cy="128" r="56" stroke="#005EB8" strokeWidth="0.5" fill="none" opacity="0.1"/>

          {/* Annotation dot */}
          <circle cx="109" cy="136" r="4" fill="#FFDD00" opacity="0.8"/>
          <line x1="113" y1="133" x2="128" y2="124" stroke="#FFDD00" strokeWidth="1" opacity="0.7"/>
          <text x="130" y="122" fill="#FFDD00" fontSize="8" opacity="0.8">Navicular</text>
        </svg>

        {/* Label */}
        <div className="mt-3 text-center">
          <p className="text-white font-bold text-[13px] leading-[18px] opacity-90">
            3D Recovery Viewer
          </p>
          <p className="text-white text-[11px] leading-[16px] opacity-55 mt-1">
            Blender model embeds here
          </p>
        </div>
      </div>

      {/* Scanning line animation */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          left:       0,
          right:      0,
          height:     '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,94,184,0.6), rgba(255,221,0,0.8), rgba(0,94,184,0.6), transparent)',
          animation:  'scan-line 3s ease-in-out infinite',
          top:        '40%',
          pointerEvents: 'none',
        }}
      />

      {/* HUD Controls overlay */}
      <div
        className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-20"
        aria-label="Viewer controls (active when Blender model is loaded)"
      >
        <div className="flex gap-2">
          {[
            { icon: 'zoom_in',             label: 'Zoom in' },
            { icon: '3d_rotation',          label: 'Rotate model' },
            { icon: 'center_focus_strong',  label: 'Reset camera view' },
          ].map(({ icon, label }) => (
            <button
              key={icon}
              className="bg-gds-black/80 text-white p-2 flex items-center justify-center hover:bg-nhs-blue transition-colors focus:outline-none focus:ring-2 focus:ring-nhs-focus-yellow"
              aria-label={label}
              title="Active when Blender model is loaded"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                {icon}
              </span>
            </button>
          ))}
        </div>

        <span className="bg-white border-2 border-gds-black px-2 py-1 font-bold text-[12px] leading-[16px] text-gds-black">
          Blender Ready ✓
        </span>
      </div>
    </div>
  )
}
