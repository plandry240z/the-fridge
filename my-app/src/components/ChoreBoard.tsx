import AddTaskForm from './AddTaskForm'
import ChoreNote from './ChoreNote'
import type { TaskRow, TaskStatus } from '../lib/types'

export default function ChoreBoard({
  tasks,
  busy,
  onAddTask,
  onTaskStatus,
  onDeleteTask,
}: {
  tasks: TaskRow[]
  busy?: boolean
  onAddTask: Parameters<typeof AddTaskForm>[0]['onAdd']
  onTaskStatus: (task: TaskRow, status: TaskStatus) => void | Promise<void>
  onDeleteTask: (task: TaskRow) => void | Promise<void>
}) {
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

      <AddTaskForm disabled={busy} onAdd={onAddTask} />

      {tasks.length === 0 ? (
        <p style={{ fontFamily: '"Patrick Hand", cursive' }} className="text-lg text-[#FFF7E8]/92" aria-live="polite">
          Your fridge is suspiciously clean. Add a chore.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[1.5rem] sm:grid-cols-2">
          {tasks.map((t) => (
            <ChoreNote
              key={t.id}
              task={t}
              busy={busy}
              onStatus={(status) => void onTaskStatus(t, status)}
              onDelete={() => void onDeleteTask(t)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
