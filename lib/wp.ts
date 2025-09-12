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