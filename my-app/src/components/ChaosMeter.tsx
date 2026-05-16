import { chaosBand, chaosLabel } from '../lib/chaos'
import RaccoonMascot from './RaccoonMascot'

export default function ChaosMeter({ score }: { score: number }) {
  const band = chaosBand(score)
  const label = chaosLabel(score)

  const doodles =
    band === 'peaceful' ? (
      <div style={{ fontFamily: '"Patrick Hand", cursive' }} className="text-lg leading-snug text-[#FFF7E8]/92">
        <span aria-hidden>✨</span> sparkly mode • crumbs in witness protection <span aria-hidden>🌿</span>
      </div>
    ) : band === 'mild' ? (
      <div style={{ fontFamily: '"Patrick Hand", cursive' }} className="text-lg leading-snug text-[#FFF7E8]/92">
        crumbs caucusing • bonus sticky clones <span aria-hidden>📌</span>
      </div>
    ) : (
      <div className="space-y-3">
        <div style={{ fontFamily: '"Patrick Hand", cursive' }} className="text-lg leading-snug text-[#FFF7E8]/93">
          flies holding meetings • mold doodles scheming • legally spicy roommate energy{' '}
          <span aria-hidden>🪰🍄‍🟫</span>
        </div>
        <RaccoonMascot className="mt-3" />
      </div>
    )

  return (
    <section className="rounded-2xl border-[3px] border-[#24313a]/30 bg-black/54 p-[1.2rem] text-[#FFF7E8] shadow-[inset_0_-10px_rgba(0,0,0,0.18)] backdrop-blur-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-xl leading-tight">
            apartment chaos meter
          </h2>
          <p style={{ fontFamily: '"Patrick Hand", cursive' }} className="mt-1 text-lg leading-snug text-[#FFF7E8]/90">
            tasks enter • vibes shake out • teamwork wins-ish
          </p>
        </div>

        <div className="rounded-full border-[3px] border-[#FFE45C] bg-black/92 px-[0.9rem] py-[11px]" aria-live="polite">
          <div style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-center text-3xl leading-none tracking-tight">
            {score}
          </div>
          <div
            style={{ fontFamily: '"Nunito", sans-serif' }}
            className="mt-px text-center text-[0.72rem] font-extrabold uppercase tracking-[0.44em] text-[#FFE45C]/93"
          >
            chaos pts
          </div>
        </div>
      </header>

      <div className="mt-7">
        <div className="sr-only">{label}</div>

        <div className="h-3 rounded-full border border-black/72 bg-black/52 p-[2px]" aria-hidden>
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#61C7F2] via-[#FFE45C] to-[#FF6B6B]"
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>

        <p
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
          className="mt-3 text-xl leading-tight tracking-tight"
        >
          {label}
        </p>

        <div className="mt-[0.94rem]">{doodles}</div>
      </div>
    </section>
  )
}
