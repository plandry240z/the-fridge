import { butterbase } from './butterbase.js'
import type { TaskRow, TaskStatus } from './types'

/** Handles SDK errors and API bodies where `error` is an object (avoids "[object Object]"). */
function errMessage(e: unknown): string {
  if (e instanceof Error) {
    const ex = e as Error & { code?: string; status?: number; remediation?: string }
    let msg = ex.message?.trim() || ''
    if (msg === '[object Object]' || msg === '') {
      msg =
        ex.remediation ||
        (ex.code === 'RESOURCE_NOT_FOUND'
          ? 'Not found — check that the table exists and your app id / URL are correct.'
          : 'Request failed')
    }
    const parts = [msg]
    if (ex.code) parts.push(`[${ex.code}]`)
    if (ex.remediation && !msg.includes(ex.remediation)) parts.push(ex.remediation)
    return parts.join(' ')
  }
  if (e && typeof e === 'object') {
    const o = e as Record<string, unknown>
    const pick = (v: unknown): string | undefined => {
      if (typeof v === 'string') return v
      if (v && typeof v === 'object') {
        try {
          return JSON.stringify(v)
        } catch {
          return undefined
        }
      }
      return undefined
    }
    const msg = pick(o.message) ?? pick(o.error) ?? pick(o.msg)
    if (msg) return msg
    try {
      return JSON.stringify(e)
    } catch {
      return String(e)
    }
  }
  return String(e)
}

export async function fetchTasksForUser(userId: string): Promise<TaskRow[]> {
  const res = await butterbase
    .from<TaskRow>('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .execute()
  if (res.error) throw new Error(`tasks: ${errMessage(res.error)}`)
  return res.data ?? []
}

export async function insertTaskRow(input: {
  title: string
  assigned_to: string | null
  due_label: string | null
}): Promise<void> {
  const res = await butterbase
    .from('tasks')
    .insert({
      title: input.title,
      assigned_to: input.assigned_to,
      due_label: input.due_label,
      status: 'To Do',
      done: false,
    })
    .execute()
  if (res.error) throw new Error(`insert task: ${errMessage(res.error)}`)
}

export async function updateTaskRow(id: string, patch: Partial<TaskRow>): Promise<void> {
  const res = await butterbase.from<TaskRow>('tasks').update(patch).eq('id', id).execute()
  if (res.error) throw new Error(`update task: ${errMessage(res.error)}`)
}

export async function deleteTaskRow(id: string): Promise<void> {
  const res = await butterbase.from('tasks').delete().eq('id', id).execute()
  if (res.error) throw new Error(`delete task: ${errMessage(res.error)}`)
}

/** Maps UI actions to Butterbase fields (status + done). */
export function patchForStatus(status: TaskStatus): Pick<TaskRow, 'status' | 'done'> {
  if (status === 'Done') return { status: 'Done', done: true }
  if (status === 'In Progress') return { status: 'In Progress', done: false }
  if (status === 'Allegedly Done') return { status: 'Allegedly Done', done: false }
  return { status: 'To Do', done: false }
}

export function nowIso(): string {
  return new Date().toISOString()
}
