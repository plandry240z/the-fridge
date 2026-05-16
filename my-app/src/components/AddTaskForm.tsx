const DUE_LABELS = ['Tonight', 'Tomorrow', 'This Week'] as const

export default function AddTaskForm({
  disabled,
  onAdd,
}: {
  disabled?: boolean
  onAdd: (input: {
    title: string
    assigned_to: string | null
    due_label: (typeof DUE_LABELS)[number]
  }) => void | Promise<void>
}) {
  return (
    <form
      className="rounded-xl border-[3px] border-dashed border-[#24313a]/85 bg-black/52 p-4 backdrop-blur-sm"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const title = String(fd.get('title') ?? '').trim()
        const assignedRaw = String(fd.get('assigned_to') ?? '').trim()
        const assigned_to = assignedRaw || null
        const dueRaw = String(fd.get('due_label') ?? 'Tonight')
        const due_label =
          dueRaw === 'Tomorrow' || dueRaw === 'This Week' ? dueRaw : ('Tonight' as const)

        if (!title) return

        void onAdd({ title, assigned_to, due_label })
        e.currentTarget.reset()
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
        <div>
          <h3 style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-xl text-[#FFF7E8]">
            add a sticky 📌
          </h3>
          <p style={{ fontFamily: '"Patrick Hand", cursive' }} className="-mt-0.5 text-lg leading-tight text-[#FFF7E8]/90">
            confession: chores are multiplayer.
          </p>
        </div>
        <p style={{ fontFamily: '"Nunito", sans-serif' }} className="text-xs font-semibold uppercase tracking-[3px] text-[#FFF7E8] opacity-74">
          no blame, just sponges
        </p>
      </div>

      <label className="block">
        <span className="sr-only">Task title</span>
        <input
          required
          name="title"
          disabled={disabled}
          placeholder="e.g., evict ketchup splatter lore"
          style={{ fontFamily: '"Patrick Hand", cursive', fontSize: '22px', lineHeight: 1.15 }}
          className="w-full rounded-xl border-[3px] border-[#24313A]/54 bg-[#FFF7E8] px-[0.92rem] py-[0.94rem] text-[#24313A] shadow-[inset_0_-13px_rgba(0,0,0,0.08)] outline-none placeholder:text-[#24313A]/55 focus:border-[#61C7F2]"
        />
      </label>

      <label className="mt-4 block">
        <span style={{ fontFamily: '"Nunito", sans-serif' }} className="block pb-2 text-[11px] font-extrabold uppercase tracking-[0.31em] text-[#FFF7E8]">
          assignee (optional)
        </span>
        <input
          name="assigned_to"
          disabled={disabled}
          placeholder="nickname, roommate, or 'the brave one'"
          className="w-full rounded-xl border-[3px] border-[#24313a]/52 bg-[#FFF7E8] px-[0.94rem] py-3 disabled:opacity-60"
          style={{ fontFamily: '"Nunito", sans-serif' }}
        />
      </label>

      <label className="mt-4 block">
        <span style={{ fontFamily: '"Nunito", sans-serif' }} className="block pb-2 text-[11px] font-extrabold uppercase tracking-[0.31em] text-[#FFF7E8]">
          due vibes
        </span>
        <select
          name="due_label"
          disabled={disabled}
          className="w-full rounded-xl border-[3px] border-[#24313a]/52 bg-[#FFF7E8] px-[0.94rem] py-3 disabled:opacity-60"
          style={{ fontFamily: '"Nunito", sans-serif' }}
          defaultValue="Tonight"
        >
          {DUE_LABELS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="bb-pill bb-pill-accent mt-[0.94rem]"
        style={{ fontFamily: "'Baloo 2', sans-serif" }}
      >
        stick it to the grime
      </button>
    </form>
  )
}
