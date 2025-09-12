# Cloud Renovation Headless Blog

Starter repo for Next.js + WordPress headless blog served at /blog.


---

## Hosting Setup (Cloudways Path)

We are using **Cloudways (DigitalOcean 1GB plan)** for the WordPress backend.

### Steps
1. Log in to Cloudways dashboard and provision a new server with **DigitalOcean 1GB** (or Vultr 1GB).
2. Launch a WordPress application.
3. Map domain `blog.cloudrenovation.ca` to the Cloudways WP app in Domain Management.
4. Enable **Varnish caching** (default) and consider enabling Redis for performance.
5. Configure **backups** (Cloudways offers automated daily backups).
6. If needed, set up **SMTP/email** via the Cloudways add-on marketplace.
7. Monitor CPU/RAM usage in the Cloudways dashboard.

### Cost
- Starting at **~$12/month** on DigitalOcean via Cloudways.
- Scales easily by resizing the server or changing providers.

> Note: Cloudways is slightly more technical than SiteGround, but offers better scalability and API responsiveness for WPGraphQL queries.
