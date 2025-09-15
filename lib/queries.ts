// Fragment for post data
export const POST_FRAGMENT = `
  fragment PostFields on Post {
    id
    title
    slug
    content
    excerpt
    date
    modified
    status
    author {
      node {
        id
        name
        slug
        avatar {
          url
        }
        description
      }
    }
    featuredImage {
      node {
        id
        sourceUrl
        altText
        caption
        mediaDetails {
          width
          height
        }
      }
    }
    categories {
      nodes {
        id
        name
        slug
        description
        count
      }
    }
    tags {
      nodes {
        id
        name
        slug
        description
        count
      }
    }
  }
`;

// SEO Fragment - separate so we can use it conditionally
export const SEO_FRAGMENT = `
  fragment SeoFields on Post {
    seo {
      title
      metaDesc
      canonical
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
        mediaDetails {
          width
          height
        }
      }
      twitterTitle
      twitterDescription
      twitterImage {
        sourceUrl
      }
      schema {
        raw
      }
      focuskw
      metaRobotsNoindex
      metaRobotsNofollow
    }
  }
`;

// Get all published posts
export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: {status: PUBLISH}) {
      nodes {
        ...PostFields
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${POST_FRAGMENT}
`;

// Get single post by slug
export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

// Get posts for sitemap (lightweight)
export const GET_POSTS_SITEMAP = `
  query GetPostsSitemap($first: Int = 100) {
    posts(first: $first, where: {status: PUBLISH}) {
      nodes {
        slug
        modified
      }
    }
  }
`;

// Get recent posts (for related posts, etc)
export const GET_RECENT_POSTS = `
  query GetRecentPosts($first: Int = 5, $notIn: [ID]) {
    posts(first: $first, where: {status: PUBLISH, notIn: $notIn}) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            id
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// Get posts by category
export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($categorySlug: String!, $first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: {status: PUBLISH, categoryName: $categorySlug}) {
      nodes {
        ...PostFields
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${POST_FRAGMENT}
`;

// Get all categories
export const GET_CATEGORIES = `
  query GetCategories {
    categories(where: {hideEmpty: true}) {
      nodes {
        id
        name
        slug
        description
        count
      }
    }
  }
`;

// Get site settings
export const GET_SITE_SETTINGS = `
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
    }
  }
`;