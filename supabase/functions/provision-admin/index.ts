import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

// One-shot admin provisioning:
//   Reads ADMIN_EMAIL + ADMIN_PASSWORD secrets, creates (or updates) that
//   auth user with a confirmed email and grants the `admin` role.
// Protected by LOVABLE_CRON_SECRET so only the platform / owner can invoke it.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    )

    // Bootstrap: allowed without token only while no admin exists yet.
    const { count: adminCount } = await admin
      .from('user_roles').select('user_id', { count: 'exact', head: true }).eq('role', 'admin')
    const provided = req.headers.get('x-provision-secret') ?? ''
    const expected = Deno.env.get('ADMIN_PROVISION_TOKEN') ?? ''
    const tokenOk = !!expected && provided === expected
    if ((adminCount ?? 0) > 0 && !tokenOk) return json({ error: 'Unauthorized' }, 401)

    const email = (Deno.env.get('ADMIN_EMAIL') ?? '').trim().toLowerCase()
    const password = Deno.env.get('ADMIN_PASSWORD') ?? ''
    if (!email || !password) return json({ error: 'ADMIN_EMAIL / ADMIN_PASSWORD not set' }, 400)
    if (password.length < 8) return json({ error: 'ADMIN_PASSWORD must be at least 8 characters' }, 400)

    // Find existing user by email (paginate defensively)
    let userId: string | null = null
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
      if (error) return json({ error: error.message }, 500)
      const hit = data.users.find((u) => (u.email ?? '').toLowerCase() === email)
      if (hit) userId = hit.id
      if (data.users.length < 200) break
    }

    let created = false
    if (userId) {
      const { error } = await admin.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
      })
      if (error) return json({ error: error.message }, 500)
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (error || !data.user) return json({ error: error?.message ?? 'create failed' }, 500)
      userId = data.user.id
      created = true
    }

    const { error: roleErr } = await admin
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' })
    if (roleErr) return json({ error: roleErr.message }, 500)

    return json({ success: true, created, email })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
