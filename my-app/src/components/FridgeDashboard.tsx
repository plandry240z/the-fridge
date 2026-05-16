import type { User } from '@butterbase/sdk'

import MagnetTitle from './MagnetTitle'
import RoommateMagnets from './RoommateMagnets'
import ChoreBoard from './ChoreBoard'
import ChaosMeter from './ChaosMeter'
import type { FridgeMagnet, TaskRow, TaskStatus } from '../lib/types'
import { computeChaosScore } from '../lib/chaos'

function magnetsForUser(user: User): FridgeMagnet[] {
  const label = user.display_name || user.email.split('@')[0] || 'Roomie'
  const core: FridgeMagnet[] = [
    {
      id: user.id,
      name: label,
      emoji: user.provider === 'google' ? '🥨' : '🧊',
      avatar_color: '#61C7F2',
    },
    {
      id: 'decoy-sponge',
      name: 'Sponge Nation',
      emoji: '🧽',
      avatar_color: '#FFE45C',
    },
    {
      id: 'decoy-plant',
      name: 'Plant Congress',
      emoji: '🪴',
      avatar_color: '#93E05F',
    },
  ]
  return core
}

export default function FridgeDashboard({
  user,
  tasks,
  busy,
  onSignOut,
  onAddTask,
  onTaskStatus,
  onDeleteTask,
}: {
  user: User
  tasks: TaskRow[]
  busy?: boolean
  onSignOut: () => void | Promise<void>
  onAddTask: (input: {
    title: string
    assigned_to: string | null
    due_label: 'Tonight' | 'Tomorrow' | 'This Week'
  }) => void | Promise<void>
  onTaskStatus: (task: TaskRow, status: TaskStatus) => void | Promise<void>
  onDeleteTask: (task: TaskRow) => void | Promise<void>
}) {
  const chaos = computeChaosScore(tasks)
  const magnets = magnetsForUser(user)

  return (
    <div className="min-h-svh bg-[#FFF7E8] px-3 pb-16 pt-4 md:px-6" style={{ fontFamily: '"Nunito", sans-serif' }}>
      <div className="mx-auto max-w-6xl rounded-[2.25rem] border-[5px] border-[#24313A]/22 bg-gradient-to-br from-[#a8b0b6] via-[#8e969b] to-[#6f767c] p-[3px] shadow-[0_32px_0_#4b5563/34,0_50px_100px_rgba(36,49,58,0.35)]">
        <div className="rounded-[2.05rem] bg-[#9aa1a6] px-3 py-6 md:px-8 md:py-10">
          <div className="rounded-[1.65rem] border-[3px] border-black/18 bg-gradient-to-b from-[#bfc5ca] to-[#8e969b] px-2 shadow-[inset_0_12px_40px_rgba(255,255,255,0.2),inset_0_-18px_40px_rgba(0,0,0,0.12)] md:px-5">
            <div className="rounded-[1.35rem] bg-[#8e969b] px-2 pt-2 md:px-4">
              <header className="flex flex-col gap-4 border-b-[3px] border-dashed border-black/20 pb-6 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <MagnetTitle />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
                  <div
                    className="max-w-[14rem] truncate rounded-2xl border-[3px] border-white/85 bg-black/30 px-4 py-2 text-sm font-semibold text-[#FFF7E8] shadow-inner backdrop-blur-sm"
                    title={user.email}
                  >
                    <span style={{ fontFamily: "'Baloo 2', sans-serif" }} className="block truncate text-base">
                      {user.display_name || user.email}
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] opacity-80">signed in</span>
                  </div>
                  <button
                    type="button"
                    className="bb-pill bb-pill-ghost"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                    onClick={() => void onSignOut()}
                  >
                    Log out
                  </button>
                </div>
              </header>

              <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
                <RoommateMagnets magnets={magnets} />
                <ChoreBoard tasks={tasks} busy={busy} onAddTask={onAddTask} onTaskStatus={onTaskStatus} onDeleteTask={onDeleteTask} />
                <ChaosMeter score={chaos} />
              </div>

              <footer
                className="border-t-[3px] border-dashed border-black/18 px-1 py-6 text-center text-[#24313A]"
                style={{ fontFamily: '"Patrick Hand", cursive' }}
              >
                <p className="text-lg md:text-xl">
                  mini roommate chat is taking a nap — go microwave something wholesome together{' '}
                  <span aria-hidden>🍿</span>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
