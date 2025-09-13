export default {
  async fetch(req) {
    const url = new URL(req.url);
    const BLOG_PREFIX = '/blog';
    const VERCEL_HOST = 'your-vercel-app.vercel.app';
    if (url.pathname.startsWith(BLOG_PREFIX)) {
      const upstream = new URL(req.url);
      upstream.hostname = VERCEL_HOST;
      upstream.protocol = 'https:';
      upstream.pathname = upstream.pathname.replace(/^\/blog/, '');
      if (upstream.pathname === '') upstream.pathname = '/';
      const resp = await fetch(upstream.toString(), req);
      const h = new Headers(resp.headers);
      h.set('x-cf-worker-route', 'blog');   // debug flag
      return new Response(resp.body, { status: resp.status, headers: h });
    }
    return fetch(req);
  }
};