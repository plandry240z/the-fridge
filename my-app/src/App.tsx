import { useCallback, useEffect, startTransition, useState } from 'react'
import type { User } from '@butterbase/sdk'

import AuthScreen from './components/AuthScreen'
import FridgeDashboard from './components/FridgeDashboard'
import { butterbase } from './lib/butterbase.js'
import {
  deleteTaskRow,
  fetchTasksForUser,
  insertTaskRow,
  nowIso,
  patchForStatus,
  updateTaskRow,
} from './lib/tasksApi'
import type { TaskRow, TaskStatus } from './lib/types'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<TaskRow[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loadErr, setLoadErr] = useState<string | null>(null)

  const refreshTasks = useCallback(async (u: User) => {
    setLoadErr(null)
    try {
      const rows = await fetchTasksForUser(u.id)
      setTasks(rows)
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    const { unsubscribe } = butterbase.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) setTasks([])
    })

    void (async () => {
      await butterbase.auth.handleOAuthCallback()
      const { data } = await butterbase.auth.getUser()
      if (data) setUser(data)
      setHydrated(true)
    })()

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    startTransition(() => {
      void refreshTasks(user)
    })
  }, [user, refreshTasks])

  async function handleSignOut() {
    setBusy(true)
    await butterbase.auth.signOut()
    setTasks([])
    setBusy(false)
  }

  async function handleAddTask(input: {
    title: string
    assigned_to: string | null
    due_label: 'Tonight' | 'Tomorrow' | 'This Week'
  }) {
    if (!user) return
    setBusy(true)
    setLoadErr(null)
    try {
      await insertTaskRow(input)
      await refreshTasks(user)
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  async function handleTaskStatus(task: TaskRow, status: TaskStatus) {
    if (!user) return
    setBusy(true)
    setLoadErr(null)
    try {
      const base = patchForStatus(status)
      await updateTaskRow(task.id, { ...base, updated_at: nowIso() })
      await refreshTasks(user)
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteTask(task: TaskRow) {
    if (!user) return
    if (!window.confirm('Yeet this chore into the void? (It will be gone. Like the last pizza slice.)')) return
    setBusy(true)
    setLoadErr(null)
    try {
      await deleteTaskRow(task.id)
      await refreshTasks(user)
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  if (!hydrated) {
    return (
      <div
        className="grid min-h-svh place-items-center bg-[#FFF7E8] px-6 text-center text-[#24313A]"
        style={{ fontFamily: '"Patrick Hand", cursive', fontSize: '1.35rem' }}
      >
        tuning the condenser coils… please hold your leftovers warmly
      </div>
    )
  }

  return (
    <>
      <AuthScreen user={user} />
      {user && (
        <>
          {loadErr && (
            <div
              className="fixed bottom-4 left-1/2 z-50 max-w-lg -translate-x-1/2 rounded-2xl border-[3px] border-[#FF6B6B] bg-[#24313A] px-4 py-3 text-sm text-[#FFF7E8] shadow-lg"
              style={{ fontFamily: '"Nunito", sans-serif' }}
              role="alert"
            >
              {loadErr}
            </div>
          )}
          <FridgeDashboard
            user={user}
            tasks={tasks}
            busy={busy}
            onSignOut={handleSignOut}
            onAddTask={handleAddTask}
            onTaskStatus={handleTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        </>
      )}
    </>
  )
}
