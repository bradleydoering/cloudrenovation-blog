export async function wp<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const endpoint = process.env.WP_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT;
  
  if (!endpoint) {
    throw new Error('WordPress GraphQL endpoint not configured');
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'CloudReno-Blog/1.0'
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }
    
    return json.data as T;
  } catch (error) {
    console.error('WordPress GraphQL request failed:', error);
    throw error;
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function createExcerpt(content: string, maxLength: number = 160): string {
  const stripped = content.replace(/<[^>]*>/g, '');
  return stripped.length > maxLength 
    ? stripped.substring(0, maxLength).trim() + '...'
    : stripped;
}

// Transform WordPress GraphQL response to match our TypeScript types
export function transformPost(wpPost: any): any {
  return {
    ...wpPost,
    author: wpPost.author?.node || wpPost.author,
    featuredImage: wpPost.featuredImage?.node ? {
      id: wpPost.featuredImage.node.id,
      url: wpPost.featuredImage.node.sourceUrl,
      alt: wpPost.featuredImage.node.altText,
      caption: wpPost.featuredImage.node.caption,
      width: wpPost.featuredImage.node.mediaDetails?.width,
      height: wpPost.featuredImage.node.mediaDetails?.height,
    } : null,
    categories: wpPost.categories?.nodes || wpPost.categories || [],
    tags: wpPost.tags?.nodes || wpPost.tags || [],
    seo: wpPost.seo ? {
      title: wpPost.seo.title,
      description: wpPost.seo.metaDesc,
      canonical: wpPost.seo.canonical,
      ogTitle: wpPost.seo.opengraphTitle,
      ogDescription: wpPost.seo.opengraphDescription,
      ogImage: wpPost.seo.opengraphImage?.node ? {
        url: wpPost.seo.opengraphImage.node.sourceUrl,
        width: wpPost.seo.opengraphImage.node.mediaDetails?.width,
        height: wpPost.seo.opengraphImage.node.mediaDetails?.height,
      } : undefined,
      twitterTitle: wpPost.seo.twitterTitle,
      twitterDescription: wpPost.seo.twitterDescription,
      twitterImage: wpPost.seo.twitterImage?.node ? {
        url: wpPost.seo.twitterImage.node.sourceUrl,
      } : undefined,
      schema: wpPost.seo.schema?.raw,
      focusKeyword: wpPost.seo.focuskw,
      metaRobotsNoindex: wpPost.seo.metaRobotsNoindex,
      metaRobotsNofollow: wpPost.seo.metaRobotsNofollow,
    } : undefined,
  };
}