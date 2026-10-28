// Forwards fixed public URLs (feeds, storage files) to the backend so the
// addresses that search engines and feed readers already know keep working.
const BACKEND = `https://${import.meta.env['VITE_SUPABASE_PROJECT_ID']}.supabase.co`;

export async function proxyToBackend(request: Request, path: string): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(path, BACKEND);
  incoming.searchParams.forEach((v, k) => target.searchParams.set(k, v));
  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: {
      accept: request.headers.get("accept") ?? "*/*",
      apikey: import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ?? '',
    },
  });
  const headers = new Headers();
  for (const h of ["content-type", "cache-control", "etag", "last-modified", "content-length"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}
