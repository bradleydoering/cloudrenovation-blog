# CloudReno Blog & CMS Design Spec

> **Purpose:** Ensure the headless WordPress → Next.js blog matches the CloudReno brand system while supporting long-form reading, SEO, and editorial workflows. Based on the unified design spec.

---

## 0. Scope
- Applies to **`/blog`** routes served by the Next.js frontend.
- Blog inherits **base design tokens** and **UI components** from the unified spec.
- Adds **typographic rhythm**, **post layout**, and **SEO injection patterns**.

---

## 1. Brand & Assets
- Logos, favicon, and OG images follow the unified canonical assets.
- Use the same **Space Grotesk / Inter / JetBrains Mono** font stack and variable setup.
- Apply the **coral gradient** to blog CTAs (subscribe, next article buttons).

---

## 2. Typography (Blog Context)
- **Headings (h1–h3):** As in unified spec, but add wider margins for readability.
- **Body text:** `max-w-prose` (~65ch) centered, font size `1.125rem` (18px) at desktop.
- **Quotes:** Stylized with coral left border `border-l-4 border-coral pl-4 italic`.
- **Code snippets:** Use JetBrains Mono, shaded background `bg-navy/5 rounded-md p-4`.

---

## 3. Layout
- **Container:** `max-w-3xl mx-auto px-4 md:px-6`.
- **Article header:**  
  - Title (`h1`) bold Space Grotesk 600, `text-3xl md:text-4xl`.  
  - Byline under title with Inter, smaller (`text-sm`), muted foreground.  
  - Featured image `rounded-lg shadow glass`.  

- **Post body:** wrapped in `.prose prose-lg font-inter`.
- **Sidebar (optional future):** For categories, “most read,” and lead-gen CTAs. Not in v1.

---

## 4. SEO Elements
- **Dynamic metadata** pulled from WPGraphQL SEO plugin.  
- Inject **JSON-LD Article schema** from WordPress.  
- Blog index: paginated, with canonical `/blog/page/[n]`.  
- Sitemap served at `/blog/sitemap.xml`.  

---

## 5. Components
- **PostCard.tsx**:  
  - Image top → title → excerpt → “Read more” coral gradient link.  
  - Consistent with CTA/button styles from unified spec.  

- **SeoHead.tsx**:  
  - Renders `title`, `description`, OG/Twitter tags.  
  - Includes JSON-LD `<script>` from WordPress SEO plugin.  

- **Prose.tsx**:  
  - Tailwind typography plugin.  
  - Extend with brand palette:  
    ```css
    .prose a { color: var(--coral); text-decoration: underline; }
    .prose strong { color: hsl(var(--foreground)); font-weight: 600; }
    .prose blockquote { border-left-color: var(--coral); }
    ```

---

## 6. Navigation & Footer
- Use the **same navbar** and **footer** components as the main site.
- Blog index → “Blog” highlighted in nav.  
- Footer should include blog categories or tags in a compact list.

---

## 7. Patterns & Backgrounds
- Use **offwhite sections with dotted pattern** for the blog index.  
- Individual posts: clean white background (`bg-cloudwhite`) to prioritize readability.  
- Coral gradient buttons for **“Next post / Previous post”** navigation.

---

## 8. Animations
- Apply **puff animation** for featured image load-in.  
- CTA hover → gradient-slide animation.  
- No distracting animations inside article body.

---

## 9. CMS Guidelines (WordPress)
- **Block editor only** (Gutenberg) → avoid inline styling.  
- Editors should set:  
  - **Featured image** (used as OG + hero image).  
  - **Excerpt** (used in previews + meta description if not overridden).  
  - **SEO meta title/description** in plugin panel.  
- Categories = blog section taxonomy (Bathroom, Kitchen, Tech).  
- Tags = SEO keywords (secondary).

---

## 10. Governance
- Follow same **governance rules**:  
  - No `!important` in styles.  
  - Gradients use token definitions.  
  - Visual parity QA: compare blog vs. main site nav, buttons, spacing.  

---


---

## 11. Hosting & Setup Notes (Cloudways Path)

For this project we will use **Cloudways (DigitalOcean 1GB plan)** as the WordPress backend host.

### Why Cloudways
- Provides more performance headroom and scalability than shared hosts.
- Dedicated resources (RAM/CPU) per droplet, better response times for WPGraphQL.
- Easier to scale up if traffic grows beyond initial assumptions.

### Extra Setup Work vs SiteGround
- You will provision a server in Cloudways dashboard (choose DigitalOcean 1GB or Vultr).
- Configure domain mapping so `blog.cloudrenovation.ca` points to the Cloudways WP app.
- Enable and configure caching layers (Varnish, Redis if needed).
- Set up backups (Cloudways provides snapshots, but confirm frequency).
- Configure SMTP/email via add-on (Cloudways does not bundle email hosting).
- Use SSH/SFTP if you need to manage files directly.
- Keep an eye on server monitoring in the Cloudways dashboard (CPU/RAM usage).

### Cost
- Starting at ~$12/mo for 1GB DigitalOcean plan (billed monthly, no lock-in).
- Can scale vertically by increasing RAM/CPU with a few clicks in Cloudways dashboard.

> **Note:** This requires slightly more technical setup than SiteGround, but ensures long-term flexibility and better performance for WPGraphQL API calls.


✅ **Result:** `/blog` feels fully integrated into cloudrenovation.ca, with the same brand language, but optimized for long-form readability and SEO-first publishing.
