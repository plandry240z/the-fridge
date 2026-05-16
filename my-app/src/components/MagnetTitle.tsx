const LINE1 = ['T', 'H', 'E'] as const
const LINE2 = ['F', 'R', 'I', 'D', 'G', 'E'] as const

const MAGNET_COLORS = [
  '#61C7F2',
  '#F58ACB',
  '#FFE45C',
  '#93E05F',
  '#FF6B6B',
  '#BDEBFF',
  '#FFD6E8',
] as const

function Letter({
  letter,
  colorIdx,
}: {
  letter: string
  colorIdx: number
}) {
  const bg = MAGNET_COLORS[colorIdx % MAGNET_COLORS.length]
  const jitter = (((colorIdx + letter.charCodeAt(0)) % 8) / 100) * 10 - 2.5

  return (
    <span
      className="magnet-letter inline-flex min-w-[1.9rem] select-none flex-col overflow-hidden rounded-md border-[3px] border-white/95 px-[0.3rem] py-[0.15rem] text-[clamp(2.05rem,4.5vw,3.15rem)] font-bold leading-none shadow-[inset_0_-6px_rgba(0,0,0,0.12),0_6px_0_rgba(0,0,0,0.12),0_12px_20px_rgba(36,49,58,0.23)] ring-2 ring-black/40 transition-[transform,color] hover:-translate-y-0.5 hover:brightness-105"
      style={{
        transform: `rotate(${jitter}deg)`,
        backgroundColor: bg,
        fontFamily: "'Baloo 2', sans-serif",
        color: '#24313A',
      }}
      aria-hidden
    >
      {letter}
      <span
        className="pointer-events-none h-1 rounded bg-white/30"
        style={{ marginInline: '-0.1rem', marginTop: '0.12rem', marginBottom: '0.06rem' }}
      />
    </span>
  )
}

export default function MagnetTitle() {
  return (
    <div className="flex flex-col items-center gap-2 pb-4 pt-6">
      <p className="font-['Patrick_Hand',cursive] text-lg text-[#24313A]/80 md:text-xl">
        us vs the mess ✨{' '}
        <span className="rounded-full bg-white/30 px-2 py-[0.1rem]">not you vs anybody</span>
      </p>
      <div className="relative flex flex-col items-center gap-2 rounded-3xl px-6 py-3">
        <div className="-mt-4 flex gap-3">
          {LINE1.map((l, idx) => (
            <Letter key={`l1-${idx}`} letter={l} colorIdx={idx} />
          ))}
        </div>
        <div className="-mb-8 flex gap-4">
          {LINE2.map((l, idx) => (
            <Letter key={`l2-${idx}`} letter={l} colorIdx={idx + LINE1.length} />
          ))}
        </div>
        <svg
          className="pointer-events-none absolute inset-[-8px]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <filter id="magnet-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="6" stdDeviation="2" floodColor="#24313a" floodOpacity="0.18" />
            </filter>
          </defs>
          <ellipse
            cx="50%"
            cy="115%"
            rx="48%"
            ry="18%"
            fill="#24313a"
            opacity={0.12}
          />
        </svg>
      </div>
    </div>
  )
}
