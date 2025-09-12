# Cloud Renovation Blog - Deployment Guide

This guide will walk you through deploying your headless WordPress + Next.js blog to production.

## 🏗️ Architecture Overview

```
WordPress (Cloudways) → WPGraphQL → Next.js (Vercel) → Cloudflare Worker → cloudrenovation.ca/blog
```

## 📋 Prerequisites Checklist

- [ ] Cloudways account with DigitalOcean 1GB server
- [ ] WordPress site at `blog.cloudrenovation.ca`
- [ ] Vercel account
- [ ] Cloudflare account with domain access
- [ ] GitHub repository

## 🔧 Step 1: WordPress Backend Setup (Cloudways)

### 1.1 Server & WordPress Installation
1. Log into Cloudways dashboard
2. Create new server: **DigitalOcean 1GB** (~$12/mo)
3. Launch WordPress application
4. Map domain `blog.cloudrenovation.ca` in Domain Management

### 1.2 Required WordPress Plugins
Install these plugins via wp-admin:

```
✅ WPGraphQL (free)
✅ WPGraphQL for Yoast SEO (free) 
✅ Yoast SEO (free)
✅ WP Webhooks (free)
```

### 1.3 WordPress Configuration
- **Permalinks:** Settings > Permalinks > Post name (`/%postname%/`)
- **Timezone:** America/Vancouver
- **Search Engine Visibility:** Unchecked (allow indexing)

### 1.4 Test GraphQL Endpoint
Visit: `https://blog.cloudrenovation.ca/graphql`
Should show GraphQL playground interface.

## 🚀 Step 2: Deploy Next.js to Vercel

### 2.1 GitHub Setup
```bash
# Push your local repo to GitHub
git add .
git commit -m "Complete blog implementation"
git push origin main
```

### 2.2 Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and connect GitHub
2. Import your blog repository
3. Configure build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 2.3 Environment Variables in Vercel
Add these in Vercel dashboard > Settings > Environment Variables:

```bash
WP_GRAPHQL_ENDPOINT=https://blog.cloudrenovation.ca/graphql
NEXT_PUBLIC_SITE_URL=https://cloudrenovation.ca
REVALIDATE_TOKEN=your-super-long-random-token-here
```

Generate secure tokens:
```bash
# Use this to generate random tokens
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy
Click **Deploy** - your blog will be available at `your-app.vercel.app`

## 🌐 Step 3: Cloudflare Worker Proxy

### 3.1 Create Cloudflare Worker
1. Go to Cloudflare dashboard > Workers & Pages
2. Create new Worker
3. Replace default code with:

```javascript
export default {
  async fetch(req) {
    const url = new URL(req.url);
    const BLOG_PREFIX = '/blog';
    const VERCEL_HOST = 'your-vercel-app.vercel.app'; // ⚠️ UPDATE THIS

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

### 3.2 Add Route
1. Go to Workers & Pages > your-worker > Settings > Triggers
2. Add route: `cloudrenovation.ca/blog*`
3. Save and deploy

## 🔗 Step 4: WordPress Webhooks

### 4.1 Configure WP Webhooks
1. In WordPress admin, go to WP Webhooks > Send Data
2. Create new webhook:
   - **Trigger:** Post Created/Updated
   - **URL:** `https://your-vercel-app.vercel.app/api/revalidate`
   - **Method:** POST
   - **Content Type:** application/json

### 4.2 Webhook Payload
```json
{
  "secret": "your-revalidate-token-here",
  "slug": "{{post_name}}",
  "type": "post"
}
```

## ✅ Step 5: Testing & Validation

### 5.1 Test Complete Flow
1. **WordPress:** Create a test blog post
2. **GraphQL:** Verify data at `/graphql`
3. **Next.js:** Check Vercel deployment logs
4. **Proxy:** Visit `cloudrenovation.ca/blog`
5. **Revalidation:** Webhook should trigger on post publish

### 5.2 SEO Validation
- [ ] Check `cloudrenovation.ca/blog/sitemap.xml`
- [ ] Check `cloudrenovation.ca/robots.txt`
- [ ] Validate meta tags with [metatags.io](https://metatags.io)
- [ ] Submit sitemap to Google Search Console

## 🛠️ Step 6: Performance Optimization

### 6.1 Cloudways Optimizations
- Enable **Varnish** caching (should be default)
- Consider **Redis** for larger sites
- Enable **Cloudflare** through Cloudways add-on

### 6.2 Vercel Optimizations
- Blog runs on **Vercel Edge Network** (global CDN)
- **ISR** caches pages for 60 seconds
- **Static generation** at build time

## 🔍 Step 7: Monitoring & Maintenance

### 7.1 Monitoring Setup
- **Vercel Analytics:** Enable in Vercel dashboard
- **Uptime Monitoring:** Set up alerts for blog availability
- **WordPress Updates:** Keep plugins updated monthly

### 7.2 Content Management
- **Authors:** Train team on WordPress block editor
- **SEO:** Use Yoast for meta descriptions and focus keywords
- **Images:** Optimize before upload (WebP recommended)

## 🚨 Troubleshooting

### Common Issues

**GraphQL Errors:**
```bash
# Test GraphQL endpoint
curl https://blog.cloudrenovation.ca/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts { nodes { title } } }"}'
```

**Build Failures:**
- Check Vercel build logs
- Verify environment variables
- Ensure WordPress is accessible

**Webhook Not Working:**
```bash
# Test revalidation endpoint
curl -X POST https://your-app.vercel.app/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-token","slug":"test"}'
```

**Proxy Issues:**
- Check Cloudflare Worker logs
- Verify route configuration
- Test direct Vercel URL first

## 📞 Support

For deployment issues:
1. Check Vercel build logs
2. Review WordPress error logs in Cloudways
3. Test each component independently
4. Verify all environment variables are set

---

🎉 **Once deployed, your blog will be live at `cloudrenovation.ca/blog` with:**
- ⚡ Instant updates via webhooks
- 🔍 Perfect SEO with meta tags and sitemaps  
- 🎨 CloudReno brand styling
- 📱 Mobile-responsive design
- ⚡ Global CDN performance