export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Allegedly Done'

export type DueLabel = 'Tonight' | 'Tomorrow' | 'This Week'

/** Fridge magnet sticker (UI only — not loaded from Butterbase). */
export interface FridgeMagnet {
  id: string
  name: string
  avatar_color: string
  emoji: string
}

export interface TaskRow {
  id: string
  title: string
  done: boolean
  status: TaskStatus | string
  assigned_to: string | null
  due_label: string | null
  created_at: string
  updated_at: string
  user_id: string
}

export type Roommate = FridgeMagnet

/** Legacy types kept for unused demo components in the repo. */
export interface CleaningUpdateRow {
  id: string
  message: string
  type: string
  created_at: string
}

export interface ChatMessageRow {
  id: string
  sender: string
  message: string
  created_at: string
}

export interface TranslatorRow {
  id: string
  original_message: string
  translated_message: string
  created_at: string
}
