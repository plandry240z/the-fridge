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
    <section className="rounded-2xl border-[3px] border-[#FFD6E8] bg-black/93 p-4 text-[#FFF7E8] backdrop-blur-sm">
      <header className="mb-3">
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif" }} className="text-lg">
          passive-aggressive translator
        </h2>
        <p style={{ fontFamily: '"Patrick Hand", cursive' }} className="text-base opacity-90">
          paste rage, receive diplomacy (demo widget — wire to Butterbase when you need history).
        </p>
      </header>

      <textarea
        value={draft}
        disabled={disabled}
        onChange={(e) => {
          setDraft(e.target.value)
          setTranslatedPreview(null)
        }}
        placeholder="WHO LEFT THE SPOON"
        rows={3}
        className="w-full rounded-xl border-[3px] border-[#24313A]/35 bg-[#FFF7E8] p-3 text-[#24313A] outline-none focus:border-[#61C7F2]"
        style={{ fontFamily: '"Patrick Hand", cursive', fontSize: '1.15rem' }}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          className="bb-pill bb-pill-accent"
          style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '0.78rem' }}
          onClick={() => setTranslatedPreview(translatePassiveAggressive(draft))}
        >
          soften it
        </button>
        <button
          type="button"
          disabled={disabled || !translatedPreview}
          className="bb-pill bb-pill-ghost"
          style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '0.78rem' }}
          onClick={() => {
            if (!translatedPreview) return
            setSaving(true)
            void onSave(draft, translatedPreview).finally(() => setSaving(false))
          }}
        >
          {saving ? 'saving…' : 'save pair'}
        </button>
      </div>

      {translatedPreview && (
        <p
          className="mt-4 rounded-xl border-[3px] border-[#BDEBFF]/60 bg-[#24313A]/45 p-3 text-[#FFF7E8]"
          style={{ fontFamily: '"Patrick Hand", cursive', fontSize: '1.1rem' }}
        >
          {translatedPreview}
        </p>
      )}

      {recent.length > 0 && (
        <ul className="mt-4 space-y-2 text-left text-sm" style={{ fontFamily: '"Nunito", sans-serif' }}>
          {recent.map((row) => (
            <li key={row.id} className="rounded-lg bg-white/10 px-2 py-1">
              <span className="opacity-80">{row.original_message}</span>
              <span className="mx-1">→</span>
              <span>{row.translated_message}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
