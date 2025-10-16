import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Prose from '../../components/Prose';
import { wp, formatDate, transformPost } from '../../lib/wp';
import { GET_POST_BY_SLUG, GET_RECENT_POSTS } from '../../lib/queries';
import { generateSEOMetadata, generateJSONLD, generateBreadcrumbJSONLD } from '../../lib/seo';
import type { PostResponse, Post } from '../../lib/types';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getPost(slug: string): Promise<Post | null> {
  try {
    const data = await wp<PostResponse>(GET_POST_BY_SLUG, { slug });
    return data.post ? transformPost(data.post) : null;
  } catch (error) {
    console.error(`Failed to fetch post with slug: ${slug}`, error);
    return null;
  }
}

async function getRelatedPosts(excludeId: string): Promise<Post[]> {
  try {
    const data = await wp<{ posts: { nodes: Post[] } }>(GET_RECENT_POSTS, { 
      first: 3, 
      notIn: [excludeId] 
    });
    return data.posts.nodes.map(transformPost);
  } catch (error) {
    console.error('Failed to fetch related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Cloud Renovation Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  const seoData = generateSEOMetadata(post);
  
  return {
    title: seoData.title,
    description: seoData.description,
    alternates: {
      canonical: seoData.canonical,
    },
    openGraph: {
      title: seoData.openGraph.title,
      description: seoData.openGraph.description,
      url: seoData.openGraph.url,
      siteName: seoData.openGraph.siteName,
      images: seoData.openGraph.images,
      type: 'article',
    },
    twitter: {
      card: seoData.twitter.card,
      title: seoData.twitter.title,
      description: seoData.twitter.description,
      images: seoData.twitter.images,
    },
    robots: {
      index: seoData.robots?.index,
      follow: seoData.robots?.follow,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const [post, relatedPosts] = await Promise.all([
    getPost(params.slug),
    // We'll fetch related posts after we have the post ID
    Promise.resolve([])
  ]);
  
  if (!post) {
    notFound();
  }

  // Now fetch related posts with the actual post ID
  const related = await getRelatedPosts(post.id);

  const seoData = generateSEOMetadata(post);
  const jsonLd = generateJSONLD(post);
  const breadcrumbJsonLd = generateBreadcrumbJSONLD(post);

  return (
    <article className="min-h-screen bg-cloudwhite dot-grid-light">
        {/* Breadcrumbs */}
        <nav className="bg-gray-50 py-4">
          <div className="max-w-3xl mx-auto px-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="https://cloudrenovation.ca" className="hover:text-coral transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/" className="hover:text-coral transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 truncate">
                {post.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Article Header */}
        <header className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.slice(0, 3).map((category) => (
                  <Link
                    key={category.id}
                    href={`/?category=${encodeURIComponent(category.slug)}`}
                    className="inline-block px-3 py-1 text-sm font-medium text-coral bg-coral/10 border border-coral/20 hover:bg-coral/20 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="font-space-grotesk font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
              {/* Author */}
              {post.author && (
                <div className="flex items-center">
                  {post.author.avatar?.url && (
                    <Image
                      src={post.author.avatar.url}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="mr-3 border border-gray-200"
                    />
                  )}
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}

              {/* Date */}
              <time dateTime={post.date} className="text-gray-500">
                {formatDate(post.date)}
              </time>

              {/* Modified date if different */}
              {post.modified !== post.date && (
                <span className="text-gray-400 text-sm">
                  Updated {formatDate(post.modified)}
                </span>
              )}
            </div>

            {/* Featured Image */}
            {post.featuredImage?.url && (
              <div className="mb-8">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  width={post.featuredImage.width || 1200}
                  height={post.featuredImage.height || 630}
                  className="w-full border-2 border-gray-200"
                  priority
                />
                {post.featuredImage.caption && (
                  <p className="text-sm text-gray-500 mt-2 text-center italic">
                    {post.featuredImage.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="pb-16">
          <div className="max-w-3xl mx-auto px-4">
            <Prose>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </Prose>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-space-grotesk font-semibold text-lg mb-4 text-gray-900">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-200"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="bg-cloudwhite dot-grid-light py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="font-space-grotesk font-bold text-3xl mb-8 text-gray-900 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white border-2 border-gray-200 hover:border-coral transition-colors overflow-hidden">
                    {relatedPost.featuredImage?.url && (
                      <div className="aspect-video relative">
                        <Image
                          src={relatedPost.featuredImage.url}
                          alt={relatedPost.featuredImage.alt || relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-space-grotesk font-semibold text-lg mb-2 text-gray-900 leading-tight">
                        <Link href={`/${relatedPost.slug}`} className="hover:text-coral transition-colors">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <time dateTime={relatedPost.date} className="text-gray-400 text-xs">
                        {formatDate(relatedPost.date)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-navy blueprint-grid py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-space-grotesk font-bold text-3xl mb-4 text-white">
              Ready to Start Your Renovation?
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Let our experts help you transform your space into something extraordinary.
            </p>
            <a
              href="https://cloudrenovation.ca/contact"
              className="btn-coral inline-block px-8 py-4 text-white bg-coral hover:bg-coral-dark border-2 border-coral"
            >
              Get Your Free Consultation
            </a>
          </div>
        </section>
      </article>
  );
}