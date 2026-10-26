import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

// One-time importer: pulls the full catalog (categories, products, images)
// from the legacy WooCommerce store and stores it in this project's database
// + `product-images` storage bucket. Runs in batches: POST { offset, limit }.

const SOURCE = 'https://aarambeanbag.com/wp-json/wc/store/v1'
const UA = 'Mozilla/5.0 (compatible; RelaxoImporter/1.0)'

const rebrand = (s: string) =>
  (s ?? '')
    .replaceAll('aarambeanbag.com', 'relaxobeanbag.com')
    .replaceAll('Aaram Bean Bag', 'Relaxo Bean Bag')
    .replaceAll('AARAM', 'RELAXO')
    .replaceAll('Aaram', 'Relaxo')
    .replaceAll('aaram', 'relaxo')
    .replaceAll('আরাম বিন ব্যাগ', 'রিলাক্সো বিন ব্যাগ')
    .replaceAll('আরাম (Relaxo)', 'রিলাক্সো (Relaxo)')
    .replaceAll('আরাম (Aaram)', 'রিলাক্সো (Relaxo)')

const stripHtml = (s: string) =>
  (s ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const expected = Deno.env.get('AARAM_IMPORT_TOKEN') ?? ''
  if (!expected || req.headers.get('x-import-secret') !== expected) return json({ error: 'Unauthorized' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  const { offset = 0, limit = 10 } = (await req.json().catch(() => ({}))) as {
    offset?: number
    limit?: number
  }

  const log: string[] = []

  try {
    // ── 1. categories (idempotent upsert by slug) ──────────────────────────
    const catRes = await fetch(`${SOURCE}/products/categories?per_page=100`, { headers: { 'User-Agent': UA } })
    const wcCats = (await catRes.json()) as any[]
    const catMap = new Map<string, string>() // slug -> uuid

    for (const [i, c] of wcCats.entries()) {
      const slug = c.slug as string
      const { data: existing } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle()
      if (existing) {
        catMap.set(slug, existing.id)
        continue
      }
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: rebrand(c.name),
          slug,
          description: rebrand(stripHtml(c.description ?? '')) || null,
          image_url: c.image?.src ?? null,
          is_active: true,
          sort_order: i,
        })
        .select('id')
        .single()
      if (error) throw new Error(`category ${slug}: ${error.message}`)
      catMap.set(slug, data.id)
    }
    log.push(`categories ready: ${catMap.size}`)

    // ── 2. products batch ─────────────────────────────────────────────────
    const page = Math.floor(offset / limit) + 1
    const prodRes = await fetch(`${SOURCE}/products?per_page=${limit}&page=${page}&orderby=date&order=desc`, {
      headers: { 'User-Agent': UA },
    })
    const totalHeader = Number(prodRes.headers.get('x-wp-total') ?? 0)
    const products = (await prodRes.json()) as any[]

    let imported = 0
    let skipped = 0

    for (const [idx, wp] of products.entries()) {
      const slug = wp.slug as string

      const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle()
      if (existing) {
        skipped++
        continue
      }

      // images → storage
      const urls: string[] = []
      for (const [n, img] of (wp.images ?? []).entries()) {
        try {
          const r = await fetch(img.src, { headers: { 'User-Agent': UA } })
          if (!r.ok) continue
          const buf = new Uint8Array(await r.arrayBuffer())
          const extMatch = (img.src as string).split('?')[0].match(/\.(jpe?g|png|webp|gif)$/i)
          const ext = (extMatch?.[1] ?? 'jpg').toLowerCase()
          const path = `imported/${slug}-${n}.${ext}`
          const { error: upErr } = await supabase.storage.from('product-images').upload(path, buf, {
            contentType: r.headers.get('content-type') ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
            upsert: true,
          })
          if (upErr && !upErr.message.includes('exists')) continue
          const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path)
          urls.push(pub.publicUrl)
        } catch (_) {
          /* skip broken image */
        }
      }

      const price = Number(wp.prices?.price ?? 0) / 100
      const regular = Number(wp.prices?.regular_price ?? 0) / 100
      const hasDiscount = regular > price && price > 0
      const catSlugs = (wp.categories ?? []).map((c: any) => c.slug)
      const primaryCat = catSlugs.length ? catMap.get(catSlugs[0]) ?? null : null
      const inStock = wp.is_in_stock !== false

      const bullets = rebrand(wp.short_description ?? '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .split('\n')
        .map((l: string) => l.replace(/&nbsp;/g, ' ').replace(/^[*•\-\s]+/, '').trim())
        .filter((l: string) => l.length > 1)
        .slice(0, 12)

      const { data: inserted, error } = await supabase
        .from('products')
        .insert({
          name: rebrand(wp.name),
          slug,
          description: rebrand(wp.description ?? ''),
          short_description: stripHtml(rebrand(wp.short_description ?? '')).slice(0, 300) || null,
          price,
          original_price: hasDiscount ? regular : null,
          discount_percent: hasDiscount ? Math.round(((regular - price) / regular) * 100) : null,
          sku: wp.sku || null,
          stock_quantity: inStock ? 25 : 0,
          status: inStock ? 'active' : 'out_of_stock',
          category_id: primaryCat,
          image_url: urls[0] ?? null,
          images: urls,
          image_alt: rebrand(wp.name),
          tags: (wp.tags ?? []).map((t: any) => rebrand(t.name)),
          brand: 'Relaxo Bean Bag',
          is_digital: false,
          product_type: 'physical',
          delivery_type: 'shipping',
          delivery_time: 'ঢাকায় ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৪ দিন',
          warranty_note: '১৮ মাসের অফিসিয়াল ওয়ারেন্টি (স্টিচিং ও ম্যাটেরিয়ালের উপর)',
          refund_note: 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধের সুযোগ (ক্যাশ অন ডেলিভারি)',
          what_you_get: bullets,
          sort_order: offset + idx,
          seo_title: `${rebrand(wp.name)} | Relaxo Bean Bag`.slice(0, 60),
          seo_description: (stripHtml(rebrand(wp.short_description ?? wp.description ?? '')) ||
            rebrand(wp.name)).slice(0, 155),
          is_featured: false,
        })
        .select('id')
        .single()
      if (error) throw new Error(`product ${slug}: ${error.message}`)

      const links = catSlugs
        .map((s: string) => catMap.get(s))
        .filter(Boolean)
        .map((cid: string) => ({ product_id: inserted.id, category_id: cid }))
      if (links.length) await supabase.from('product_categories').upsert(links, { onConflict: 'product_id,category_id' })

      imported++
    }

    return json({
      success: true,
      offset,
      limit,
      total: totalHeader,
      batch: products.length,
      imported,
      skipped,
      done: offset + products.length >= totalHeader || products.length === 0,
      log,
    })
  } catch (e) {
    return json({ error: String((e as Error).message ?? e), log }, 500)
  }
})
