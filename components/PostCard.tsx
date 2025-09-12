import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '../lib/wp';
import type { Post } from '../lib/types';
import clsx from 'clsx';

interface PostCardProps {
  post: Post;
  className?: string;
  priority?: boolean;
}

export default function PostCard({ post, className, priority = false }: PostCardProps) {
  const hasImage = post.featuredImage?.url;
  
  return (
    <article 
      className={clsx(
        'group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300',
        'border border-gray-100 overflow-hidden',
        'hover:-translate-y-1 hover:border-gray-200',
        className
      )}
    >
      {/* Featured Image */}
      {hasImage && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.featuredImage!.url}
            alt={post.featuredImage!.alt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Glass overlay effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="inline-block px-2 py-1 text-xs font-medium text-coral bg-coral/10 rounded-full hover:bg-coral/20 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
        
        {/* Title */}
        <h2 className="font-space-grotesk font-semibold text-xl mb-3 text-gray-900 leading-tight group-hover:text-coral transition-colors">
          <Link href={`/blog/${post.slug}`} className="stretched-link">
            {post.title}
          </Link>
        </h2>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-base leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            {/* Author */}
            {post.author && (
              <span className="flex items-center">
                {post.author.avatar?.url && (
                  <Image
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    width={20}
                    height={20}
                    className="rounded-full mr-2"
                  />
                )}
                <span className="font-medium">{post.author.name}</span>
              </span>
            )}
            
            {/* Date */}
            <time dateTime={post.date} className="text-gray-400">
              {formatDate(post.date)}
            </time>
          </div>
          
          {/* Read more indicator */}
          <span className="text-coral font-medium group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
}