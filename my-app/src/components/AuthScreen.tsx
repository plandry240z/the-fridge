import { useState, type FormEvent } from 'react'
import type { User } from '@butterbase/sdk'

import MagnetTitle from './MagnetTitle'
import { butterbase, butterbaseConfigured } from '../lib/butterbase.js'

const PILL =
  'inline-flex items-center justify-center rounded-full border-[3px] border-[#24313A]/20 bg-[#FFF7E8] px-5 py-2.5 text-sm font-bold text-[#24313A] shadow-[0_6px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-45'
const INPUT =
  'w-full rounded-xl border-[3px] border-[#24313A]/35 bg-white px-4 py-3 text-[#24313A] outline-none placeholder:text-[#24313A]/45 focus:border-[#61C7F2]'

export default function AuthScreen({ user }: { user: User | null }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [verifyEmail, setVerifyEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyOpen, setVerifyOpen] = useState(false)

  const configured = butterbaseConfigured()

  async function onLogin(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setBanner(null)
    setBusy(true)
    const { error } = await butterbase.auth.signIn({ email, password })
    setBusy(false)
    if (error) {
      setErr(error.message || 'Login nope’d. Try again with feelings.')
      return
    }
    setBanner('Welcome back to the cool zone (the fridge).')
  }

  async function onSignup(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setBanner(null)
    setBusy(true)
    const { data, error } = await butterbase.auth.signUp({ email, password })
    setBusy(false)
    if (error) {
      setErr(error.message || 'Signup glitch. Password needs drama: 8+ chars, upper, lower, number, symbol.')
      return
    }
    setVerifyOpen(true)
    setVerifyEmail(email)
    setBanner(data?.message ?? 'Check your email for a 6-digit verification code. Spam folder is also a roommate.')
  }

  async function onVerify(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    const { error } = await butterbase.auth.verifyEmail(verifyEmail, verifyCode.trim())
    setBusy(false)
    if (error) {
      setErr(error.message || 'Code rejected. The fridge whispered no.')
      return
    }
    setBanner('Email verified! You may now log in like a legend.')
    setVerifyOpen(false)
    setMode('login')
  }

  function onGoogle() {
    setErr(null)
    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const { url } = butterbase.auth.signInWithOAuth({ provider: 'google', redirectTo })
    window.location.href = url
  }

  if (user) return null

  return (
    <div
      className="min-h-svh bg-[#FFF7E8] px-4 py-10"
      style={{ fontFamily: '"Nunito", sans-serif' }}
    >
      <div className="mx-auto max-w-md rounded-[2rem] border-[4px] border-[#24313A]/25 bg-[#8E969B] p-[2px] shadow-[0_28px_0_#4B5563]/38,0_44px_80px_rgba(36,49,58,0.28)]">
        <div className="rounded-[1.78rem] bg-gradient-to-b from-[#a8afb4] via-[#8e969b] to-[#7a8288] px-5 pb-10 pt-4">
          <MagnetTitle />

          {!configured && (
            <div
              className="mb-5 rounded-2xl border-[3px] border-dashed border-[#FFE45C]/90 bg-black/55 px-4 py-3 text-left text-sm text-[#FFF7E8]"
              style={{ fontFamily: '"Patrick Hand", cursive' }}
            >
              Missing{' '}
              <code className="rounded bg-black/35 px-1">VITE_BUTTERBASE_APP_ID</code> or{' '}
              <code className="rounded bg-black/35 px-1">VITE_BUTTERBASE_URL</code> in{' '}
              <code className="rounded bg-black/35 px-1">.env</code>. The magnets are here but the API is shy.
            </div>
          )}

          <div className="flex gap-2 rounded-2xl bg-black/45 p-1.5 backdrop-blur-sm">
            <button
              type="button"
              className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold uppercase tracking-wide transition ${
                mode === 'login'
                  ? 'bg-[#FFF7E8] text-[#24313A] shadow-[0_6px_0_rgba(0,0,0,0.16)]'
                  : 'text-[#FFF7E8]/85 hover:bg-white/10'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
              onClick={() => {
                setMode('login')
                setErr(null)
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold uppercase tracking-wide transition ${
                mode === 'signup'
                  ? 'bg-[#FFF7E8] text-[#24313A] shadow-[0_6px_0_rgba(0,0,0,0.16)]'
                  : 'text-[#FFF7E8]/85 hover:bg-white/10'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
              onClick={() => {
                setMode('signup')
                setErr(null)
              }}
            >
              Sign up
            </button>
          </div>

          {banner && (
            <p
              className="mt-4 rounded-xl border-[3px] border-[#93E05F]/55 bg-[#D9F99D]/35 px-3 py-2 text-left text-lg text-[#24313A]"
              style={{ fontFamily: '"Patrick Hand", cursive' }}
            >
              {banner}
            </p>
          )}
          {err && (
            <p
              className="mt-3 rounded-xl border-[3px] border-[#FF6B6B]/55 bg-black/40 px-3 py-2 text-left text-base text-[#FFD6E8]"
              style={{ fontFamily: '"Patrick Hand", cursive' }}
            >
              {err}
            </p>
          )}

          <form className="mt-6 space-y-3 text-left" onSubmit={mode === 'login' ? onLogin : onSignup}>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#FFF7E8]">Email</span>
              <input
                className={`${INPUT} mt-1.5`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy || !configured}
                placeholder="you@apartment.rules"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#FFF7E8]">Password</span>
              <input
                className={`${INPUT} mt-1.5`}
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={busy || !configured}
                placeholder="•••••••• (make it spicy)"
              />
            </label>
            <p className="text-[0.72rem] text-[#FFF7E8]/78" style={{ fontFamily: '"Patrick Hand", cursive' }}>
              Password rules (email signup): 8+ characters, upper, lower, number, symbol. Like a wifi password, but readable by humans.
            </p>
            <button
              type="submit"
              disabled={busy || !configured}
              className={`${PILL} w-full border-[#24313A]/28 bg-[#FFE45C] text-[#24313A]`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {mode === 'login' ? 'Unlock fridge' : 'Create account'}
            </button>
          </form>

          <div className="relative py-8">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#FFF7E8]/35" />
            <span
              className="relative mx-auto block w-fit rounded-full bg-[#4B5563] px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.4em] text-[#FFF7E8]/90"
              style={{ fontFamily: '"Nunito", sans-serif' }}
            >
              or
            </span>
          </div>

          <button
            type="button"
            disabled={busy || !configured}
            className={`${PILL} w-full gap-2 border-[#24313A]/28 bg-white`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
            onClick={() => void onGoogle()}
          >
            <span aria-hidden>🍯</span> Continue with Google
          </button>

          {verifyOpen && (
            <form className="mt-8 space-y-3 rounded-2xl border-[3px] border-dashed border-[#BDEBFF] bg-black/35 p-4" onSubmit={onVerify}>
              <p className="text-lg text-[#FFF7E8]" style={{ fontFamily: '"Patrick Hand", cursive' }}>
                Paste the 6-digit vibe code from your inbox:
              </p>
              <input
                className={INPUT}
                placeholder="email@used.com"
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
                type="email"
                required
              />
              <input
                className={INPUT}
                placeholder="123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
              <button
                type="submit"
                disabled={busy || !configured}
                className={`${PILL} w-full bg-[#61C7F2] text-[#24313A]`}
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                Verify & become official
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
