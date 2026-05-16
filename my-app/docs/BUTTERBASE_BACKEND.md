# Butterbase backend: The Fridge (auth + tasks)

Apply once per Butterbase app (replace `YOUR_APP_ID`). Use the **Butterbase MCP** tools `manage_schema` and `manage_rls`, or your dashboard.

## 1. Schema: `tasks` table

`manage_schema` action: `apply`

```json
{
  "app_id": "YOUR_APP_ID",
  "action": "apply",
  "name": "fridge_tasks_v1",
  "schema": {
    "tables": {
      "tasks": {
        "columns": {
          "id": { "type": "uuid", "primaryKey": true, "default": "gen_random_uuid()" },
          "title": { "type": "text", "nullable": false },
          "done": { "type": "boolean", "nullable": false, "default": "false" },
          "status": { "type": "text", "nullable": false, "default": "'To Do'" },
          "assigned_to": { "type": "text", "nullable": true },
          "due_label": { "type": "text", "nullable": true },
          "created_at": { "type": "timestamptz", "nullable": false, "default": "now()" },
          "updated_at": { "type": "timestamptz", "nullable": false, "default": "now()" },
          "user_id": { "type": "uuid", "nullable": false }
        }
      }
    }
  }
}
```

## 2. Row-level security (user isolation)

`manage_rls` action: `create_user_isolation`

- **`table_name`:** `tasks`
- **`user_column`:** `user_id`

This enables RLS, adds policies so each signed-in user only sees and mutates their own rows, and installs a **before-insert trigger** that sets `user_id` from the JWT (`current_user_id()`). The frontend does **not** need to send `user_id` on insert.

## 3. Google sign-in

Configure the Google OAuth provider for your app (MCP `manage_oauth` action `configure`, or dashboard). Add your dev origin (e.g. `http://localhost:5173`) to allowed **redirect URIs** as required by Google and Butterbase.

## 4. CORS

Allow your frontend origin in the Butterbase app CORS settings so the browser can call the API and auth endpoints.

## Troubleshooting: Sign up returns “not found” (404)

The SDK calls `POST {apiUrl}/auth/{appId}/signup` and `GET {apiUrl}/v1/{appId}/tasks` — **`apiUrl` must be the API host only**, e.g. `https://api.butterbase.ai`. If you paste `https://api.butterbase.ai/v1/app_xxx`, you get a broken URL like `.../v1/app_xxx/auth/app_xxx/signup` (**404**). The client now auto-strips a trailing `/v1/{appId}` if it matches your configured app id.

1. **`VITE_BUTTERBASE_URL`** / **`VITE_BUTTERBASE_API_URL`** = **host root only** (no `/v1/...`).
2. **`VITE_BUTTERBASE_APP_ID`** must match your app exactly (e.g. `app_...`).
3. Restart the Vite dev server after editing `.env`.
4. In the browser **Network** tab, inspect the failed request’s full URL — that’s the fastest way to see a wrong base or missing app id.
