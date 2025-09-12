const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blog.cloudrenovation.ca' },
      { protocol: 'https', hostname: '*.wp.com' }
    ]
  }
};
export default nextConfig;
