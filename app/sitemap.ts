import { MetadataRoute } from 'next';
import { wp } from '../lib/wp';
import { GET_POSTS_SITEMAP } from '../lib/queries';
import type { SitemapResponse } from '../lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudrenovation.ca';
  
  try {
    // Fetch all published posts for sitemap
    const data = await wp<SitemapResponse>(GET_POSTS_SITEMAP, { first: 1000 });
    const posts = data.posts.nodes;
    
    // Create sitemap entries for blog posts
    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    
    // Add blog index page
    const blogIndex: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];
    
    return [...blogIndex, ...postEntries];
    
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    
    // Return at least the blog index if posts fail to load
    return [
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];
  }
}