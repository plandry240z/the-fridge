import type { Roommate } from '../lib/types'

function MagnetSticker({ roommate }: { roommate: Roommate }) {
  const tilt = roommate.name.length % 2 === 0 ? -2 : 2

  return (
    <figure
      className="magnet-chip group relative flex max-w-[19rem] flex-col gap-2 rounded-[1.85rem] border-[7px] border-white/92 p-4 shadow-[inset_0_-8px_rgba(0,0,0,0.12),0_10px_0_rgba(0,0,0,0.1),0_18px_32px_rgba(36,49,58,0.28)] outline outline-4 outline-black/25 transition duration-200 hover:z-30 hover:-translate-y-1 hover:-rotate-1"
      style={{
        backgroundColor: roommate.avatar_color,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <figcaption className="sr-only">{roommate.name}</figcaption>
      <div className="flex items-center gap-3">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-white/95 bg-black/20 text-[2.05rem]"
          aria-hidden
        >
          {roommate.emoji}
        </div>
        <div className="min-w-0 text-left">
          <span
            className="inline-block truncate rounded-lg bg-black/65 px-2 py-0.5 text-sm uppercase tracking-widest shadow-inner"
            style={{ fontFamily: "'Baloo 2', sans-serif", color: '#FFF7E8' }}
          >
            {roommate.name}
          </span>
          <p
            className="mt-1 text-base leading-snug text-[#24313A]/92"
            style={{ fontFamily: '"Patrick Hand", cursive' }}
          >
            certified snack representative
          </p>
        </div>
      </div>
    </figure>
  )
}

export default function RoommateMagnets({ roommates }: { roommates: Roommate[] }) {
  return (
    <section className="fridge-well flex flex-col gap-6">
      <header className="px-4 pt-2">
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif" }} className="flex items-center gap-2 text-xl text-[#24313A]">
          roommate magnets <span aria-hidden>🧲</span>
        </h2>
        <p
          style={{ fontFamily: "'Patrick Hand', cursive" }}
          className="mt-1 max-w-[18rem] text-lg leading-tight text-[#24313A]/90"
        >
          friendly faces guarding the hummus order of operations.
        </p>
      </header>

      <div className="flex flex-wrap gap-4 px-2 pb-2">
        {roommates.map((r) => (
          <MagnetSticker key={r.id} roommate={r} />
        ))}
        {!roommates.length && (
          <p
            className="text-base italic text-[#24313A]/76"
            style={{ fontFamily: '"Patrick Hand", cursive' }}
          >
            no magnets yet… did everybody phase into noodle soup??
          </p>
        )}
      </div>
    </section>
  )
}
