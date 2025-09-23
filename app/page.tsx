import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PostCard from '../components/PostCard';
import { wp, transformPost } from '../lib/wp';
import { GET_ALL_POSTS, GET_POSTS_BY_CATEGORY, GET_CATEGORIES } from '../lib/queries';
import { generateBlogIndexSEO } from '../lib/seo';
import type { PostsResponse, Category } from '../lib/types';

export const metadata: Metadata = {
  title: 'Home in the Clouds - Cloud Renovation',
  description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
  openGraph: {
    title: 'Home in the Clouds',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    url: 'https://cloudrenovation.ca/blog',
    siteName: 'Cloud Renovation',
    images: [{
      url: 'https://cloudrenovation.ca/og-blog.jpg',
      width: 1200,
      height: 630,
      alt: 'Home in the Clouds - Cloud Renovation Blog',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home in the Clouds',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    images: ['https://cloudrenovation.ca/og-blog.jpg'],
  },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds
// Use dynamic rendering so searchParams (e.g., ?category=) take effect on the server.
// Data fetches still leverage ISR via the GraphQL client's fetch revalidation.
export const dynamic = 'force-dynamic';

async function getPosts(categorySlug?: string) {
  try {
    if (categorySlug) {
      const data = await wp<PostsResponse>(GET_POSTS_BY_CATEGORY, { categorySlug, first: 12 });
      return data.posts.nodes.map(transformPost);
    } else {
      const data = await wp<PostsResponse>(GET_ALL_POSTS, { first: 12 });
      return data.posts.nodes.map(transformPost);
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const data = await wp<{ categories: { nodes: Category[] } }>(GET_CATEGORIES, {});
    return data.categories.nodes;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function BlogIndex({ searchParams }: { searchParams?: { category?: string } }) {
  const category = searchParams?.category;
  const [posts, categories] = await Promise.all([
    getPosts(category),
    getCategories()
  ]);
  
  if (!posts.length) {
    // If no posts are found, show a coming soon message instead of 404
    return (
      <div className="min-h-screen bg-cloudwhite">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="font-jetbrains-mono font-bold text-4xl mb-6 text-gray-900">
              Home in the Clouds
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.
            </p>
            <div className="bg-white p-8 border-2 border-gray-200 dot-grid-light">
              <h2 className="font-space-grotesk font-semibold text-2xl mb-4 text-gray-900">
                Coming Soon
              </h2>
              <p className="text-gray-600">
                We're preparing amazing content about home renovation and improvement. 
                Check back soon for expert tips and insights!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const seoData = generateBlogIndexSEO();

  return (
    <div className="min-h-screen bg-cloudwhite dot-grid-light">
        {/* Header Section */}
        <div className="bg-navy blueprint-grid py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-jetbrains-mono font-bold text-4xl md:text-5xl mb-6 text-white">
              Home in the Clouds
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.
            </p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className={
                `px-4 py-2 text-sm font-medium border-2 transition-colors ${!category ? 'bg-coral text-white border-coral' : 'bg-white text-gray-700 border-gray-200 hover:border-coral hover:text-coral'}`
              }
              prefetch={false}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.slug)}`}
                className={
                  `px-4 py-2 text-sm font-medium border-2 transition-colors ${category === cat.slug ? 'bg-coral text-white border-coral' : 'bg-white text-gray-700 border-gray-200 hover:border-coral hover:text-coral'}`
                }
                prefetch={false}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Empty state for selected category */}
          {category && posts.length === 0 && (
            <div className="text-center text-gray-700 bg-white border-2 border-gray-200 p-8">
              No articles found in “{category}” yet.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                priority={index < 3} // Priority loading for first 3 images
              />
            ))}
          </div>

          {/* Load More Section - Future Enhancement */}
          {posts.length >= 12 && (
            <div className="text-center mt-12">
              <p className="text-gray-600">
                More posts coming soon...
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-cloudwhite dot-grid-light py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-space-grotesk font-bold text-3xl mb-4 text-gray-900">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get expert renovation advice and turn your house into the home of your dreams.
            </p>
            <a
              href="https://cloudrenovation.ca/get-started"
              className="btn-coral inline-block px-8 py-4"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
  );
}
