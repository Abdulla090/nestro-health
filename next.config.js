/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable middleware temporarily to prevent redirect loops
  skipMiddlewareUrlNormalize: true,
  
  // Optimize font loading
  optimizeFonts: true,
  
  // Increase the priority of static assets
  staticPageGenerationTimeout: 180,
  
  // Define redirects at the build level
  async redirects() {
    return [
      {
        source: '/auth/signin',
        destination: '/create-profile?from=signin',
        permanent: false,
      },
      {
        source: '/auth/signup',
        destination: '/create-profile?from=signup',
        permanent: false,
      },
    ]
  },
  
  // Add headers to ensure fonts are loaded correctly
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig 