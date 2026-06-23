const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: basePath,
  basePath,
  output: 'export',
  trailingSlash: true,
  turbopack: {
    root: new URL('.', import.meta.url).pathname
  },
  images: {
    unoptimized: true
  }
}

export default nextConfig
