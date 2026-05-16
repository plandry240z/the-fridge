import { createClient } from '@butterbase/sdk'

/**
 * Butterbase client for The Fridge.
 *
 * Env (Vite):
 *   VITE_BUTTERBASE_URL      — API base (same host as auth + data API)
 *   VITE_BUTTERBASE_ANON_KEY — public anon key (optional but typical for REST)
 *   VITE_BUTTERBASE_APP_ID   — your app id (required by the SDK)
 *
 * Back-compat: VITE_BUTTERBASE_API_URL is treated like VITE_BUTTERBASE_URL.
 */
const appId = String(
  import.meta.env.VITE_BUTTERBASE_APP_ID ?? import.meta.env.VITE_BUTTERBASE_PROJECT_ID ?? '',
)
  .trim()

const rawApiUrl = String(
  import.meta.env.VITE_BUTTERBASE_URL ?? import.meta.env.VITE_BUTTERBASE_API_URL ?? '',
).trim()

/**
 * Dashboard copy/paste often looks like `https://api…/v1/{appId}`.
 * The SDK expects the *host root* only: it builds `/auth/{appId}/…` and `/v1/{appId}/…` itself.
 */
function normalizeApiUrl(url, id) {
  let u = url.replace(/\/+$/, '')
  if (id && u.endsWith(`/v1/${id}`)) {
    u = u.slice(0, -(`/v1/${id}`.length)).replace(/\/+$/, '')
  }
  return u
}

const apiUrl = normalizeApiUrl(rawApiUrl, appId)

const anonKey = String(import.meta.env.VITE_BUTTERBASE_ANON_KEY ?? '').trim()

export const butterbase = createClient({
  appId,
  apiUrl,
  anonKey: anonKey || undefined,
})

export function butterbaseConfigured() {
  return Boolean(appId && apiUrl)
}
