# Headless WordPress + Next.js Blog Setup (cloudrenovation.ca)

This playbook describes how to set up a headless WordPress CMS with a Next.js frontend deployed on Vercel, proxied through Cloudflare Workers so that your blog lives under **cloudrenovation.ca/blog**.

---

## 0. Files for Claude (the "build kit")

```
headless-blog/
├─ README.md                          # Step-by-step runbook below
├─ .env.example                       # Env schema
├─ next.config.mjs                    # Next.js config (images, domains)
├─ vercel.json                        # Optional, routes/headers
├─ package.json
├─ tsconfig.json
├─ app/
│  ├─ blog/
│  │  ├─ page.tsx                     # /blog listing route (ISR)
│  │  ├─ [slug]/
│  │  │  └─ page.tsx                 # /blog/my-article (ISR)
│  │  └─ sitemap.ts                   # /blog/sitemap.xml
│  ├─ robots.ts                       # robots.txt
│  └─ api/
│     ├─ revalidate/route.ts          # Vercel revalidate endpoint
│     └─ preview/route.ts             # WordPress preview (optional)
├─ lib/
│  ├─ wp.ts                           # GraphQL client
│  ├─ queries.ts                      # WPGraphQL queries & fragments
│  ├─ seo.ts                          # SEO helpers (Open Graph, JSON-LD)
│  └─ types.ts                        # TS types
├─ components/
│  ├─ PostCard.tsx
│  ├─ Prose.tsx
│  ├─ SeoHead.tsx                     # SEO injection
│  └─ Pagination.tsx (optional)
├─ public/
│  └─ favicon.ico
└─ cloudflare-worker/
   └─ worker.js                       # Proxy /blog/* → Vercel app
```

---

## 1. WordPress CMS (backend)

- **Host**: **Cloudways (DigitalOcean 1GB plan, ~$12/mo)** — chosen for better scalability and performance.
  - Provision via Cloudways dashboard (select DigitalOcean or Vultr 1GB).
  - Map `blog.cloudrenovation.ca` to the WordPress app created.
  - Enable caching (Varnish is on by default, Redis optional).
  - Configure backups and SMTP/email add-on as needed.
  - Monitor CPU/RAM in Cloudways dashboard.
- **Purpose**: Pure CMS, no frontend theming needed.

### Required Plugins
- WPGraphQL
- WPGraphQL for Yoast *or* WPGraphQL for RankMath
- Yoast SEO *or* RankMath
- SearchAtlas SEO plugin (or OTTO pixel if plugin not used)
- WPGraphQL Upload (optional, for media)
- WP Webhooks (to trigger Vercel revalidate)

### Settings
- Permalinks: `/%postname%/`
- Timezone: America/Vancouver
- "Discourage search engines" → OFF
- Create author, categories, and at least 2 test posts.

### Endpoint
Ensure `https://blog.cloudrenovation.ca/graphql` works.

### Webhook
WP Webhooks → "Post Published/Updated" → POST to Vercel:

```
https://<your-vercel-app>.vercel.app/api/revalidate
Body: { "secret": "<REVALIDATE_TOKEN>", "slug": "{{post.post_name}}" }
```

---

## 2. Next.js App on Vercel

### .env.example
```bash
NEXT_PUBLIC_SITE_URL=https://cloudrenovation.ca
WP_GRAPHQL_ENDPOINT=https://blog.cloudrenovation.ca/graphql
REVALIDATE_TOKEN=superlongrandomstring
WP_PREVIEW_SECRET=anotherlongrandomstring
```

### next.config.mjs
```js
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blog.cloudrenovation.ca' },
      { protocol: 'https', hostname: '*.wp.com' }
    ]
  }
};
export default nextConfig;
```

### lib/wp.ts
```ts
export async function wp<T>(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}
```

*(Full queries and page.tsx files should match the playbook provided earlier.)*

---

## 3. Cloudflare Worker (to serve at /blog)

**cloudflare-worker/worker.js**

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    const BLOG_PREFIX = '/blog';
    const VERCEL_HOST = 'your-vercel-app.vercel.app';

    if (url.pathname === '/blog') {
      return Response.redirect(`${url.origin}/blog/`, 301);
    }

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
```

### Steps
1. Create Worker in Cloudflare dashboard.
2. Paste code above, replace `VERCEL_HOST` with your Vercel app hostname.
3. Add route: `cloudrenovation.ca/*` → Worker.

---

## 4. Styling Integration

- Copy global CSS (fonts, colors, spacing) into `app/globals.css`.
- Wrap blog pages with your site’s Header/Footer components (reuse from monorepo if possible).
- Use a `Prose.tsx` (Tailwind typography plugin) for clean post body rendering.

---

## 5. SEO Setup

- All SEO fields (title, description, OG/Twitter, JSON-LD) pulled from WPGraphQL SEO.
- Sitemap served at `/blog/sitemap.xml` → submit to Google Search Console.
- Robots.txt at `/robots.txt` pointing to sitemap.
- Ensure canonical URLs always resolve to `cloudrenovation.ca/blog/...`.

---

## 6. Deployment Flow

1. Push repo to GitHub/GitLab.
2. Connect repo to Vercel, set env vars in Vercel dashboard.
3. Deploy `main` branch.
4. Add Cloudflare Worker for `/blog` route.
5. Validate blog appears at `cloudrenovation.ca/blog`.

---

## 7. Publishing Workflow

1. Write content in WordPress wp-admin.
2. Add SEO metadata via Yoast/RankMath/SearchAtlas.
3. Publish or schedule content.
4. Next.js app pulls via GraphQL → regenerates static page via ISR.
5. Optional: WP Webhook triggers immediate revalidate.

---

## 8. Cost & Performance

- WordPress hosting: ~$10–12/mo
- Vercel: free tier (plenty for blog)
- Cloudflare Worker: free tier
- Global CDN via Vercel + Cloudflare
- ISR ensures content freshness within 60s (or instantly with webhook).

---

## 9. Next Steps

- Install WordPress backend → confirm GraphQL endpoint.
- Deploy Next.js app on Vercel using starter files above.
- Wire Cloudflare Worker to map `/blog`.
- Test: create a post → ensure it appears at `cloudrenovation.ca/blog/...` within 60s.

---

**Result:**  
A scalable, SEO-perfect blog for **cloudrenovation.ca/blog**, powered by WordPress CMS + Next.js frontend, optimized for performance and search rankings.
