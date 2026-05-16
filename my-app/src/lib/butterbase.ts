import { createClient } from '@butterbase/sdk'

import type {
  ChatMessageRow,
  CleaningUpdateRow,
  Roommate,
  TaskRow,
  TaskStatus,
  TranslatorRow,
} from './types'

const appId = import.meta.env.VITE_BUTTERBASE_APP_ID as string | undefined
const apiUrl = import.meta.env.VITE_BUTTERBASE_API_URL as string | undefined
const anonKey = import.meta.env.VITE_BUTTERBASE_ANON_KEY as string | undefined

/** Butterbase REST client — set VITE_BUTTERBASE_* in `.env` (see `.env.example`). */
export const butterbase = createClient({
  appId: appId ?? '',
  apiUrl: apiUrl ?? '',
  anonKey: anonKey || undefined,
})

export function butterbaseConfigured(): boolean {
  return Boolean(appId && apiUrl)
}

function errMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  return String(e)
}

export async function fetchRoommates(): Promise<Roommate[]> {
  const res = await butterbase
    .from<Roommate>('roommates')
    .select('*')
    .order('created_at', { ascending: true })
    .execute()
  if (res.error) throw new Error(`roommates: ${errMessage(res.error)}`)
  return res.data ?? []
}

export async function fetchTasks(): Promise<TaskRow[]> {
  const res = await butterbase
    .from<TaskRow>('tasks')
    .select('*')
    .order('created_at', { ascending: false })
    .execute()
  if (res.error) throw new Error(`tasks: ${errMessage(res.error)}`)
  return res.data ?? []
}

export async function fetchUpdates(): Promise<CleaningUpdateRow[]> {
  const res = await butterbase
    .from<CleaningUpdateRow>('updates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
    .execute()
  if (res.error) throw new Error(`updates: ${errMessage(res.error)}`)
  return res.data ?? []
}

export async function fetchChat(): Promise<ChatMessageRow[]> {
  const res = await butterbase
    .from<ChatMessageRow>('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(80)
    .execute()
  if (res.error) throw new Error(`chat_messages: ${errMessage(res.error)}`)
  const rows = res.data ?? []
  return [...rows].reverse()
}

export async function fetchTranslatorHistory(): Promise<TranslatorRow[]> {
  const res = await butterbase
    .from<TranslatorRow>('translator_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12)
    .execute()
  if (res.error) throw new Error(`translator_history: ${errMessage(res.error)}`)
  return res.data ?? []
}

export async function insertTask(input: {
  title: string
  assigned_to: string
  due_label: string
}): Promise<void> {
  const res = await butterbase.from('tasks').insert({
    title: input.title,
    assigned_to: input.assigned_to,
    due_label: input.due_label,
    status: 'To Do',
  }).execute()
  if (res.error) throw new Error(`insert task: ${errMessage(res.error)}`)
}

export async function patchTask(id: string, patch: Partial<TaskRow>): Promise<void> {
  const res = await butterbase.from<TaskRow>('tasks').update(patch).eq('id', id).execute()
  if (res.error) throw new Error(`update task: ${errMessage(res.error)}`)
}

export async function insertUpdate(input: {
  message: string
  type: string
}): Promise<void> {
  const res = await butterbase.from('updates').insert({
    message: input.message,
    type: input.type,
  }).execute()
  if (res.error) throw new Error(`insert update: ${errMessage(res.error)}`)
}

export async function insertChat(sender: string, message: string): Promise<void> {
  const res = await butterbase.from('chat_messages').insert({ sender, message }).execute()
  if (res.error) throw new Error(`insert chat: ${errMessage(res.error)}`)
}

export async function insertTranslator(original: string, translated: string): Promise<void> {
  const res = await butterbase
    .from('translator_history')
    .insert({ original_message: original, translated_message: translated })
    .execute()
  if (res.error) throw new Error(`translator save: ${errMessage(res.error)}`)
}

async function insertRoommateRow(r: Omit<Roommate, 'id' | 'created_at'> & { id?: string }) {
  const res = await butterbase.from('roommates').insert(r).execute()
  if (res.error) throw new Error(`seed roommate: ${errMessage(res.error)}`)
}

async function insertTaskRow(t: Omit<TaskRow, 'created_at' | 'updated_at'> & Partial<Pick<TaskRow, 'created_at' | 'updated_at'>>) {
  const res = await butterbase.from('tasks').insert(t).execute()
  if (res.error) throw new Error(`seed task: ${errMessage(res.error)}`)
}

async function insertUpdateRow(u: Omit<CleaningUpdateRow, 'id' | 'created_at'>) {
  const res = await butterbase.from('updates').insert(u).execute()
  if (res.error) throw new Error(`seed update: ${errMessage(res.error)}`)
}

async function insertChatRow(c: Omit<ChatMessageRow, 'id' | 'created_at'>) {
  const res = await butterbase.from('chat_messages').insert(c).execute()
  if (res.error) throw new Error(`seed chat: ${errMessage(res.error)}`)
}

/** Inserts whimsical demo dishes if Butterbase feels… empty inside. */
export async function seedIfEmpty(roommatesExisting: Roommate[]): Promise<boolean> {
  if (roommatesExisting.length > 0) return false

  await insertRoommateRow({
    name: 'Jules',
    avatar_color: '#61C7F2',
    emoji: '🍳',
  })
  await insertRoommateRow({
    name: 'Marco',
    avatar_color: '#93E05F',
    emoji: '🥑',
  })
  await insertRoommateRow({
    name: 'Sam',
    avatar_color: '#F58ACB',
    emoji: '🧃',
  })
  await insertRoommateRow({
    name: 'Rae',
    avatar_color: '#FFE45C',
    emoji: '🍕',
  })

  const refreshed = await fetchRoommates()

  const byName = Object.fromEntries(refreshed.map((r) => [r.name, r])) as Record<string, Roommate>
  const jules = byName.Jules?.id
  const marco = byName.Marco?.id
  const sam = byName.Sam?.id

  if (jules) {
    await insertTaskRow({
      title: 'Rescue leftovers from existential crisis',
      assigned_to: jules,
      status: 'To Do' satisfies TaskStatus,
      due_label: 'Tonight',
    })
  }
  if (marco) {
    await insertTaskRow({
      title: 'Trash goblin eviction (take it out kindly)',
      assigned_to: marco,
      status: 'In Progress' satisfies TaskStatus,
      due_label: 'Tomorrow',
    })
  }
  if (sam) {
    await insertTaskRow({
      title: 'Mop suspicious sticky spot™',
      assigned_to: sam,
      status: 'Allegedly Done' satisfies TaskStatus,
      due_label: 'This Week',
    })
  }

  await insertUpdateRow({
    message: 'Kitchen lightly blessed with soap and hope.',
    type: 'cleaning',
  })
  await insertUpdateRow({
    message: 'Someone left one singular spoon in the sink.',
    type: 'ambient',
  })
  await insertUpdateRow({
    message: 'The raccoon has been temporarily contained.',
    type: 'ambient',
  })

  await insertChatRow({
    sender: 'FridgeCouncil',
    message: 'friendly reminder we are teammates vs grime, thank u',
  })

  return true
}
