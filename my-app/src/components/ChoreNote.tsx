import type { TaskRow, TaskStatus } from '../lib/types'
import { stringHash } from '../lib/hash'

const STICKIES = ['#FFF3A3', '#BDEBFF', '#FFD6E8', '#D9F99D'] as const

const BTN =
  'rounded-full border-[3px] border-[#24313A]/18 bg-[#FFF7E8]/94 px-[0.72rem] py-[0.28rem] text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#24313A] shadow-[0_8px_0_rgba(0,0,0,0.1)] outline outline-4 outline-transparent transition hover:-translate-y-px hover:outline-[#24313a]/25 active:translate-y-0.5 active:shadow-[0_6px_0_rgba(0,0,0,0.1)] disabled:pointer-events-none disabled:opacity-40'

export default function ChoreNote({
  task,
  busy,
  onStatus,
  onDelete,
}: {
  task: TaskRow
  busy?: boolean
  onStatus: (status: TaskStatus) => void | Promise<void>
  onDelete: () => void | Promise<void>
}) {
  const hue = STICKIES[stringHash(task.id) % STICKIES.length]
  const tilt = (((stringHash(task.id) % 140) - 70) / 100) * 5

  const isDone = task.status === 'Done' || task.done
  const allegedly = task.status === 'Allegedly Done'

  const hand = '"Patrick Hand", cursive'
  const due = task.due_label?.trim() || 'whenever guilt peaks'

  return (
    <article
      className={[
        'relative isolate flex min-h-[12.6rem] w-full max-w-[18.75rem] flex-col gap-[0.7rem]',
        'rounded-md border-[3px] border-[#24313A]/18 px-5 pb-4 pt-[2.95rem]',
        'transition-[transform]',
        allegedly ? 'ring-4 ring-orange-900/35' : '',
        isDone ? 'opacity-94' : '',
      ].join(' ')}
      style={{
        backgroundColor: hue,
        transform: `rotate(${tilt}deg)`,
        boxShadow:
          '0 24px 0 rgba(36,49,58,0.12), inset 10px -8px rgba(255,255,255,0.35), inset -6px -8px rgba(0,0,0,0.06)',
      }}
    >
      <svg className="pointer-events-none absolute left-[1.05rem] top-[-42px]" width={140} height={58} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <ellipse cx={70} cy={28} rx={44} ry={16} fill="#bdbdbd" opacity={0.9} />
        <ellipse cx={70} cy={26} rx={42} ry={15} fill="#eaeaea" />
      </svg>

      <header className="relative z-[1] flex items-start justify-between gap-3">
        <p
          className="rounded-md bg-black/12 px-[0.45rem] py-[0.12rem] text-[0.78rem] font-extrabold uppercase tracking-[0.22em]"
          style={{ fontFamily: '"Nunito", sans-serif', color: '#24313A' }}
        >
          {due}
        </p>
        <p className="text-right text-[0.95rem] leading-tight" style={{ fontFamily: hand, color: '#24313A' }}>
          on it:{' '}
          <span className="font-semibold">
            {task.assigned_to?.trim() ? task.assigned_to : 'unclaimed fridge energy'}
          </span>
        </p>
      </header>

      <p className={`relative z-[1] flex-1 text-[1.45rem] leading-snug ${isDone ? 'line-through decoration-[0.145rem]' : ''}`} style={{ fontFamily: hand, color: '#24313A' }}>
        {task.title}
      </p>

      <p className="text-[0.84rem]" style={{ fontFamily: '"Nunito", sans-serif', color: '#24313AAA' }}>
        status:{' '}
        <span className="font-semibold text-[#24313A]">{task.status}</span>{' '}
        <span className="opacity-70">• tap a vibe below</span>
      </p>

      {isDone && (
        <div className="pointer-events-none absolute right-[-18px] top-[34%] -rotate-[12deg]" aria-hidden>
          <span
            className="inline-block rounded-2xl border-[4px] border-dashed border-[#24313a]/70 bg-black/92 px-[0.7rem] py-[6px] text-[1.05rem] shadow-[48px_-16px_0_rgba(0,0,0,0.1)] backdrop-blur-sm"
            style={{ fontFamily: "'Baloo 2', sans-serif", color: '#FFF7E8' }}
          >
            ✅ inspected & blessed
          </span>
        </div>
      )}

      {allegedly && !isDone && (
        <div className="pointer-events-none absolute right-[-10px] top-[30%] rotate-[16deg]" aria-hidden>
          <span
            className="inline-block rounded-2xl border-[4px] border-[#ef4444]/60 bg-black/92 px-[0.72rem] py-[8px] text-[1.05rem]"
            style={{ fontFamily: "'Baloo 2', sans-serif", color: '#FFF7E8' }}
          >
            hm… allegedly??
          </span>
        </div>
      )}

      <footer className="relative z-[1] flex flex-wrap gap-3 pt-[0.95rem]" style={{ fontFamily: '"Nunito", sans-serif' }}>
        <button type="button" className={BTN} disabled={busy} onClick={() => void onStatus('In Progress')}>
          in progress
        </button>
        <button type="button" className={BTN} disabled={busy} onClick={() => void onStatus('Done')}>
          done
        </button>
        <button type="button" className={BTN} disabled={busy} onClick={() => void onStatus('Allegedly Done')}>
          allegedly done
        </button>
        <button
          type="button"
          className={`${BTN} border-[#ef4444]/25 bg-[#FFD6E8]/90`}
          disabled={busy}
          onClick={() => void onDelete()}
        >
          yeet task 🗑️
        </button>
      </footer>
    </article>
  )
}
