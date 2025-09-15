import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostCard from '../components/PostCard';
import SeoHead from '../components/SeoHead';
import { wp, transformPost } from '../lib/wp';
import { GET_ALL_POSTS } from '../lib/queries';
import { generateBlogIndexSEO } from '../lib/seo';
import type { PostsResponse } from '../lib/types';

export const metadata: Metadata = {
  title: 'Blog - Cloud Renovation',
  description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
  openGraph: {
    title: 'Cloud Renovation Blog',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    url: 'https://cloudrenovation.ca/blog',
    siteName: 'Cloud Renovation',
    images: [{
      url: 'https://cloudrenovation.ca/og-blog.jpg',
      width: 1200,
      height: 630,
      alt: 'Cloud Renovation Blog',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloud Renovation Blog',
    description: 'Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.',
    images: ['https://cloudrenovation.ca/og-blog.jpg'],
  },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getPosts() {
  try {
    const data = await wp<PostsResponse>(GET_ALL_POSTS, { first: 12 });
    return data.posts.nodes.map(transformPost);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogIndex() {
  const posts = await getPosts();
  
  if (!posts.length) {
    // If no posts are found, show a coming soon message instead of 404
    return (
      <div className="min-h-screen bg-cloudwhite">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk font-bold text-4xl mb-6 text-gray-900">
              Cloud Renovation Blog
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
    <>
      <SeoHead seo={seoData} />
      
      <div className="min-h-screen bg-cloudwhite dot-grid-light">
        {/* Header Section */}
        <div className="bg-navy blueprint-grid py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-space-grotesk font-bold text-4xl md:text-5xl mb-6 text-white">
              Cloud Renovation Blog
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Expert insights on home renovation, kitchen and bathroom remodeling, and modern home improvement techniques.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
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
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-space-grotesk font-bold text-3xl mb-4 text-gray-900">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get expert renovation advice and turn your house into the home of your dreams.
            </p>
            <a
              href="https://cloudrenovation.ca/contact"
              className="btn-coral inline-block px-8 py-4"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </>
  );
}