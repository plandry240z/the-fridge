import { useMemo, useState } from 'react'

import { translatePassiveAggressive } from '../lib/translator'
import type { TranslatorRow } from '../lib/types'

export default function Translator({
  history,
  disabled,
  onSave,
}: {
  history: TranslatorRow[]
  disabled?: boolean
  onSave: (original: string, translated: string) => Promise<void>
}) {
  const [draft, setDraft] = useState('')
  const [translatedPreview, setTranslatedPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const recent = useMemo(() => history.slice(0, 6), [history])

  return (
    <section className="rounded-2xl border-[3px] border-[#FFD6E8] bg-black/93 p-4 backdrop-blur-sm">
      <header className="mb-[-2]"
      />

    </section>
  )
}

