import type { CleaningUpdateRow } from '../lib/types'

export default function UpdatesFeed({ updates }: { updates: CleaningUpdateRow[] }) {
  return (
    <section className="rounded-2xl border-[3px] border-[#24313a]/35 bg-black/74 p-4 backdrop-blur-sm shadow-[inset_0_-9px_rgba(0,0,0,0.16)]">
      <header className="mb-3">
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-xl text-[#FFF7E8]">
          cleaning updates <span aria-hidden>🫧</span>
        </h2>
        <p
          style={{ fontFamily: '"Patrick Hand", cursive' }}
          className="mt-1 text-lg leading-snug text-[#FFF7E8]/90"
        >
          mostly facts • partly folklore • persisted in Butterbase
        </p>
      </header>

      {updates.length === 0 ? (
        <p
          style={{ fontFamily: '"Patrick Hand", cursive' }}
          className="rounded-xl border-[3px] border-dashed border-white/42 bg-black/92 px-4 py-3 text-[#FFF7E8]/93"
        >
          tumbleweeds auditioning • no updates yet 👀
        </p>
      ) : (
        <ul className="max-h-[19rem] list-none space-y-3 overflow-y-auto pr-[2px]" style={{ scrollbarGutter: 'stable' }}>
          {updates.map((u) => {
            const sticker =
              u.type === 'suspicious' ? '#FFD6E8' : u.type === 'cleaning' ? '#D9F99D' : '#BDEBFF'

            const time = new Date(u.created_at)
            const stamp = Number.isFinite(time.valueOf())
              ? time.toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : 'time unknown'

            return (
              <li key={u.id}>
                <div
                  className="rounded-xl border-[3px] border-[#24313a]/22 px-[14px] py-[13px]"
                  style={{
                    backgroundColor: sticker,
                    boxShadow: '0 18px 0 rgba(0,0,0,0.1), inset -6px -6px rgba(0,0,0,0.06)',
                  }}
                >
                  <p
                    style={{ fontFamily: '"Nunito", sans-serif' }}
                    className="text-[0.74rem] font-extrabold uppercase tracking-[0.42em] text-[#24313A]/73"
                  >
                    {String(u.type).toUpperCase()} • {stamp}
                  </p>
                  <p
                    style={{ fontFamily: '"Patrick Hand", cursive' }}
                    className="mt-2 text-lg leading-snug text-[#24313A]"
                  >
                    {u.message}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
