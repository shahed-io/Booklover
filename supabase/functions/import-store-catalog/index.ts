import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

// Admin-only importer for the owner's own Shopify store catalog.
// Actions: "collections" | "products" {page} | "links" {handle,page}
const STORE = 'https://bookhavenbd.shop'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    const { data: u } = await db.auth.getUser(token)
    if (!u?.user) return json({ error: 'Unauthorized' }, 401)
    const { data: isAdmin } = await db.rpc('has_role', { _user_id: u.user.id, _role: 'admin' })
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)

    const body = await req.json().catch(() => ({}))
    const get = async (path: string) => {
      const r = await fetch(STORE + path)
      if (!r.ok) throw new Error(`[${r.status}] ${path}`)
      return r.json()
    }

    if (body.action === 'collections') {
      const { collections } = await get('/collections.json?limit=250')
      const rows = collections.filter((c: any) => c.handle !== 'all-products').map((c: any, i: number) => ({
        name: c.title, slug: c.handle, description: c.description || null,
        image_url: c.image?.src ?? null, is_active: true, sort_order: i + 1,
      }))
      const { error } = await db.from('categories').upsert(rows, { onConflict: 'slug' })
      if (error) throw error
      return json({ ok: true, count: rows.length })
    }

    if (body.action === 'products') {
      const page = Number(body.page) || 1
      const { products } = await get(`/products.json?limit=250&page=${page}`)
      const rows = products.map((p: any, i: number) => {
        const vs = (p.variants ?? []) as any[]
        const prices = vs.map((v) => Number(v.price)).filter((n) => n > 0)
        const first = vs[0] ?? {}
        const compare = Number(first.compare_at_price) || null
        const price = prices.length ? Math.min(...prices) : 0
        const available = vs.some((v) => v.available)
        const imgs = (p.images ?? []).map((im: any) => im.src)
        const optName = p.options?.[0]?.name && p.options[0].name !== 'Title' ? p.options[0].name : 'Book Cover Type'
        const hasOptions = vs.length > 1 || (first.title && first.title !== 'Default Title')
        return {
          name: p.title, slug: p.handle, description: p.body_html || null,
          price, original_price: compare && compare > price ? compare : null,
          discount_percent: compare && compare > price ? Math.round((1 - price / compare) * 100) : null,
          status: available ? 'active' : 'out_of_stock', stock_quantity: available ? 100 : 0,
          image_url: imgs[0] ?? null, images: imgs, image_alt: p.title,
          tags: p.tags ?? [], is_digital: false, product_type: 'physical', delivery_type: 'manual',
          variants: hasOptions ? [{ name: optName, options: vs.map((v) => ({ label: v.title, price: Number(v.price) })) }] : [],
          sort_order: (page - 1) * 250 + i + 1,
        }
      })
      if (!rows.length) return json({ ok: true, count: 0, done: true })
      const { error } = await db.from('products').upsert(rows, { onConflict: 'slug' })
      if (error) throw error
      return json({ ok: true, count: rows.length })
    }

    if (body.action === 'links') {
      const { handle, page } = body
      const { data: cat } = await db.from('categories').select('id').eq('slug', handle).single()
      if (!cat) return json({ error: 'category missing' }, 400)
      const { products } = await get(`/collections/${handle}/products.json?limit=250&page=${page}`)
      const slugs = products.map((p: any) => p.handle)
      if (!slugs.length) return json({ ok: true, count: 0 })
      const ps: { id: string; category_id: string | null }[] = []
      for (let k = 0; k < slugs.length; k += 40) {
        const { data, error: e1 } = await db.from('products').select('id,category_id').in('slug', slugs.slice(k, k + 40))
        if (e1) throw e1
        ps.push(...(data ?? []))
      }
      const links = (ps ?? []).map((p) => ({ product_id: p.id, category_id: cat.id }))
      const { error } = await db.from('product_categories').upsert(links, { onConflict: 'product_id,category_id', ignoreDuplicates: true })
      if (error) throw error
      const missing = (ps ?? []).filter((p) => !p.category_id).map((p) => p.id)
      if (missing.length) await db.from('products').update({ category_id: cat.id }).in('id', missing)
      return json({ ok: true, count: links.length })
    }
    if (body.action === 'images') {
      // Copy external product images into Booklover storage.
      const limit = Math.min(Number(body.limit) || 25, 50)
      const { data: ps, error: e } = await db.from('products').select('id,slug,image_url,images')
        .like('image_url', 'https://%').not('image_url', 'like', `${url}%`).gt('id', body.after || '00000000-0000-0000-0000-000000000000').order('id').limit(limit)
      if (e) throw e
      let copied = 0, failed = 0
      await Promise.all((ps ?? []).map(async (p: any) => {
        const src: string[] = (p.images?.length ? p.images : [p.image_url]).filter(Boolean)
        const out: string[] = []
        for (let i = 0; i < src.length; i++) {
          try {
            if (src[i].startsWith(url)) { out.push(src[i]); continue }
            const fu = src[i].includes('cdn.shopify.com') ? src[i] + (src[i].includes('?') ? '&' : '?') + 'width=900&format=jpg' : src[i]
            const r = await fetch(fu)
            if (!r.ok) throw new Error(String(r.status))
            const type = r.headers.get('content-type') ?? 'image/jpeg'
            const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg'
            const path = `catalog/${p.slug}-${i}.${ext}`
            const { error: ue } = await db.storage.from('product-images').upload(path, await r.arrayBuffer(), { contentType: type, upsert: true })
            if (ue) throw ue
            out.push(db.storage.from('product-images').getPublicUrl(path).data.publicUrl)
          } catch { out.push(src[i]) }
        }
        const ok = out[0] && out[0].startsWith(url)
        if (ok) { copied++; await db.from('products').update({ image_url: out[0], images: out }).eq('id', p.id) }
        else failed++
      }))
      return json({ ok: true, copied, failed, last: ps?.length ? ps[ps.length - 1].id : null, done: (ps ?? []).length === 0 })
    }
    return json({ error: 'unknown action' }, 400)
  } catch (e) {
    console.error(e)
    return json({ error: String((e as any)?.message ?? e) }, 500)
  }
})
