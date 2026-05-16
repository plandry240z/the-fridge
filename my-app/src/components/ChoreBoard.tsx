import AddTaskForm from './AddTaskForm'
import ChoreNote from './ChoreNote'
import type { Roommate, TaskRow, TaskStatus } from '../lib/types'

export default function ChoreBoard({
  roommates,
  tasks,
  busy,
  onAddTask,
  onTaskStatus,
}: {
  roommates: Roommate[]
  tasks: TaskRow[]
  busy?: boolean
  onAddTask: Parameters<typeof AddTaskForm>[0]['onAdd']
  onTaskStatus: (task: TaskRow, status: TaskStatus) => void | Promise<void>
}) {
  const byId = new Map(roommates.map((r) => [r.id, r]))

  return (
    <section className="flex flex-col gap-10">
      <header className="px-1 pt-4">
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-xl text-[#FFF7E8]">
          chore sticky wall{' '}
          <span aria-hidden>📝</span>
        </h2>
        <p style={{ fontFamily: '"Patrick Hand", cursive' }} className="mt-2 max-w-[28rem] text-lg text-[#FFF7E8]/90">
          drag your eyeballs gently across these notes. blink often. hydrate.
        </p>
      </header>

      <AddTaskForm roommates={roommates} disabled={busy} onAdd={onAddTask} />

      {tasks.length === 0 ? (
        <p style={{ fontFamily: '"Patrick Hand", cursive' }} className="text-lg text-[#FFF7E8]/92" aria-live="polite">
          zero stickies??? suspiciously immaculate.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[1.5rem] sm:grid-cols-2">
          {tasks.map((t) => (
            <ChoreNote
              key={t.id}
              task={t}
              roommate={t.assigned_to ? byId.get(t.assigned_to) : undefined}
              busy={busy}
              onStatus={(status) => void onTaskStatus(t, status)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
