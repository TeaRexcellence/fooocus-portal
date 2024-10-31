/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
      unoptimized: true,
  },
  // No basePath needed if repo name is fooocus-portal
  basePath: "/fooocus-portal", assetPrefix:"/fooocus-portal",
}

module.exports = nextConfig