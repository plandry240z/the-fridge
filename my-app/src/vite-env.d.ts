/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUTTERBASE_APP_ID: string
  readonly VITE_BUTTERBASE_URL: string
  readonly VITE_BUTTERBASE_API_URL: string
  readonly VITE_BUTTERBASE_ANON_KEY: string
  /** Back-compat alias some docs use for app id */
  readonly VITE_BUTTERBASE_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
