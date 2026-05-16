export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Allegedly Done'

export type DueLabel = 'Tonight' | 'Tomorrow' | 'This Week'

export type UpdateType = 'cleaning' | 'suspicious' | 'ambient'

export interface Roommate {
  id: string
  name: string
  avatar_color: string
  emoji: string
  created_at: string
}

export interface TaskRow {
  id: string
  title: string
  assigned_to: string | null
  status: TaskStatus | string
  due_label: string
  created_at: string
  updated_at: string
}

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
