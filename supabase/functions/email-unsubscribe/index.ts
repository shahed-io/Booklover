// Unsubscribe handler for managed email sending.
// GET  ?email=...  -> { valid: true } | { valid: false, reason }
// POST { email }   -> { success: true } | { success: false, reason }
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Unsubscribe links carry sig = HMAC-SHA256(email) keyed by the server secret.
async function signEmail(email: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! + ':unsub'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email))
  return Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    let email = url.searchParams.get('email') || ''
    let sig = url.searchParams.get('sig') || ''
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      email = (body.email || email || '').toString()
      sig = (body.sig || sig || '').toString()
    }
    email = email.trim().toLowerCase()

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ valid: false, success: false, reason: 'invalid_email' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: sub } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .maybeSingle()

    // Caller must prove control of the address: a signed link, or signed in as that email
    let authorized = !!sig && sig === (await signEmail(email))
    if (!authorized) {
      const tok = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
      if (tok) {
        const { data: u } = await supabase.auth.getUser(tok)
        authorized = (u?.user?.email || '').toLowerCase() === email
      }
    }
    if (!authorized) return json({ valid: false, success: false, reason: 'invalid_link' }, 403)

    if (req.method !== 'POST') {
      if (sub?.status === 'unsubscribed') return json({ valid: false, reason: 'already_unsubscribed' })
      return json({ valid: true })
    }

    if (sub?.status === 'unsubscribed') return json({ success: false, reason: 'already_unsubscribed' })

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email, status: 'unsubscribed', source: 'unsubscribe_link', updated_at: new Date().toISOString() },
        { onConflict: 'email' },
      )
    if (error) throw error

    return json({ success: true })
  } catch (e: any) {
    console.error('email-unsubscribe failed:', e?.message || e)
    return json({ success: false, error: 'Internal error' }, 500)
  }
})
