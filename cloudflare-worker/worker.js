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
      return fetch(new Request(upstream, req));
    }
    return fetch(req);
  }
};