# Next.js + Supabase Skill

Description
- Short: Guidance and best practices for working with a Next.js application backed by Supabase (database, auth, storage, and Edge functions).
- When to use: any Next.js app in this repo that needs user auth, row-level security (RLS) protected data, file storage, or server-side functions.

Prerequisites
- Node.js 18+ (matching the project's devcontainer/runtime)
- Install runtime dependencies:

```bash
npm install @supabase/supabase-js
npm install -D supabase
```

Recommended environment variables
- `NEXT_PUBLIC_SUPABASE_URL` — public Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key (safe for client-only operations)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only service role key (must never be exposed to browser)
- `SUPABASE_SERVICE_URL` — optional custom service URL if different from public URL

Local development
- Use the Supabase CLI for a local dev DB or connect to a project:

```bash
npx supabase login
npx supabase start   # runs local Postgres + API + Studio (requires Docker)
# create migrations: npx supabase migration new <name>
# apply migrations: npx supabase db push
```

Initializing clients (examples)

- Client (browser / client components)

```ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

- Server (server components, API routes, or Next.js server actions)

```ts
// lib/supabaseServer.ts (use only on server)
import { createClient } from '@supabase/supabase-js'

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
```

Notes on auth and session handling
- Use the anon key on the client; rely on Supabase Auth for sign-in flows.
- When you need server-side privileged access (admin queries, generating signed URLs, bypassing RLS for system jobs), use the `SUPABASE_SERVICE_ROLE_KEY` only on server code.
- For Next.js App Router, prefer server actions or server components to run privileged operations server-side.

Row-Level Security (RLS)
- Enable RLS on tables and write explicit policies that map Supabase `auth.uid()` to your table columns (e.g., owner_id).
- Test policies locally with Supabase Auth or use SQL `auth.jwt()` while debugging.

Storage and file uploads
- Use Supabase Storage for file handling. Example: create a `user-uploads` bucket with public or protected access.
- To serve private files, create signed URLs on the server using the service role key or the storage API with a server-side session.

Database migrations and seeds
- Keep SQL migrations under `supabase/migrations/` or your chosen conventions.
- Use the Supabase CLI for generating migrations and applying them to remote environments.
- Keep seed scripts in `supabase/seed/` or a project script that uses `supabase-js` to insert initial rows.

Security best practices
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend or in client bundle.
- Rotate service keys periodically in the Supabase dashboard and update secrets in deployment.
- Use RLS + policies to restrict data access rather than relying on application logic only.

Deployment notes
- Vercel: set environment variables in the Vercel project dashboard. Use server environment variables for service role keys and public for NEXT_PUBLIC_* keys.
- Netlify: set env vars in Netlify UI and ensure serverless functions have access to server keys.
- When deploying Edge Functions or serverless, prefer short-lived service tokens and follow the provider's secret-management recommendations.

Examples & Patterns
- Fetching rows (client)

```ts
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
```

- Server-side insert with service role key

```ts
const { data, error } = await supabaseServer
  .from('orders')
  .insert([{ user_id: uid, total }])
```

- Generating a signed storage URL (server)

```ts
const { data } = await supabaseServer.storage
  .from('user-uploads')
  .createSignedUrl('avatars/user123.png', 60) // 60 seconds
```

Troubleshooting
- If auth-related requests fail, confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct and not expired.
- For RLS issues, test policies by temporarily disabling RLS in a local environment and iteratively enabling checks.

References
- Supabase docs: https://supabase.com/docs
- Supabase CLI: https://supabase.com/docs/guides/cli
- supabase-js client: https://github.com/supabase/supabase-js

Maintenance
- Record schema changes as migrations and review them during PRs.
- Add integration tests that exercise common queries, auth flows, and storage operations.

Contact
- If something in this skill needs updating, open an issue or edit this file with the new steps.
