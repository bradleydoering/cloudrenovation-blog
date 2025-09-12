import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Verify the revalidation token
    const body = await request.json();
    const { secret, slug, type = 'post' } = body;
    
    // Check for secret token
    const revalidateToken = process.env.REVALIDATE_TOKEN;
    if (!revalidateToken) {
      return NextResponse.json(
        { message: 'Revalidation token not configured' },
        { status: 500 }
      );
    }
    
    if (secret !== revalidateToken) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Revalidate based on type and slug
    if (type === 'post' && slug) {
      // Revalidate specific post page
      revalidatePath(`/blog/${slug}`);
      console.log(`Revalidated post: /blog/${slug}`);
    }
    
    // Always revalidate the blog index when any post changes
    revalidatePath('/blog');
    console.log('Revalidated blog index: /blog');
    
    // Optionally revalidate sitemap
    revalidatePath('/blog/sitemap.xml');
    console.log('Revalidated sitemap: /blog/sitemap.xml');
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: slug ? [`/blog/${slug}`, '/blog', '/blog/sitemap.xml'] : ['/blog', '/blog/sitemap.xml']
    });
    
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        message: 'Error revalidating', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for manual testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  
  // Check for secret token
  const revalidateToken = process.env.REVALIDATE_TOKEN;
  if (!revalidateToken) {
    return NextResponse.json(
      { message: 'Revalidation token not configured' },
      { status: 500 }
    );
  }
  
  if (secret !== revalidateToken) {
    return NextResponse.json(
      { message: 'Invalid token. Use ?secret=YOUR_TOKEN&slug=post-slug (optional)' },
      { status: 401 }
    );
  }
  
  try {
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidatePath('/blog');
    revalidatePath('/blog/sitemap.xml');
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: slug ? [`/blog/${slug}`, '/blog', '/blog/sitemap.xml'] : ['/blog', '/blog/sitemap.xml'],
      method: 'GET'
    });
    
  } catch (error) {
    console.error('GET revalidation error:', error);
    return NextResponse.json(
      { 
        message: 'Error revalidating', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}