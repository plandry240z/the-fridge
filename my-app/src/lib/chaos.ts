import type { TaskRow, TaskStatus } from './types'

const WEIGHTS: Record<TaskStatus, number> = {
  'To Do': 96,
  'In Progress': 62,
  'Allegedly Done': 43,
  Done: 12,
}

function statusWeight(raw: string): number {
  if (raw in WEIGHTS) return WEIGHTS[raw as TaskStatus]
  return 70
}

/** 0 = calm fridge, 100 = raccoon era */
export function computeChaosScore(tasks: TaskRow[]): number {
  if (tasks.length === 0) return 18

  const sum = tasks.reduce((acc, t) => acc + statusWeight(String(t.status)), 0)
  return Math.round(Math.min(100, Math.max(0, sum / tasks.length)))
}

export type ChaosBand = 'peaceful' | 'mild' | 'raccoon'

export function chaosBand(score: number): ChaosBand {
  if (score <= 30) return 'peaceful'
  if (score <= 65) return 'mild'
  return 'raccoon'
}

export function chaosLabel(score: number): string {
  const band = chaosBand(score)
  if (band === 'peaceful') return 'Peaceful Apartment'
  if (band === 'mild') return 'Mildly Questionable'
  return 'Raccoon Has Entered'
}
