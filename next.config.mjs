const nextConfig = {
  basePath: '/blog',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blog.cloudrenovation.ca' },
      { protocol: 'https', hostname: 'wordpress-1522673-5859375.cloudwaysapps.com' },
      { protocol: 'https', hostname: '*.wp.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'gravatar.com' },
      { protocol: 'https', hostname: '*.gravatar.com' }
    ]
  }
};
export default nextConfig;
