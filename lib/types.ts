export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  status: 'publish' | 'draft' | 'private';
  author: Author;
  featuredImage?: FeaturedImage;
  categories?: Category[];
  tags?: Tag[];
  seo?: SeoData;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  description?: string;
}

export interface FeaturedImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  sizes?: string;
  srcSet?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface SeoData {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    url: string;
    width?: number;
    height?: number;
  };
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    url: string;
  };
  schema?: string; // JSON-LD schema
  focusKeyword?: string;
  metaRobotsNoindex?: boolean;
  metaRobotsNofollow?: boolean;
}

export interface PostsResponse {
  posts: {
    nodes: Post[];
    pageInfo: PageInfo;
  };
}

export interface PostResponse {
  post: Post;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  total?: number;
}

export interface SitemapPost {
  slug: string;
  modified: string;
}

export interface SitemapResponse {
  posts: {
    nodes: SitemapPost[];
  };
}

// WordPress GraphQL response wrapper
export interface WPGraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}