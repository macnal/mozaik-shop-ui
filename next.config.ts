import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: 'https',
        hostname: "upload.cdn.baselinker.com",
      }
    ],
  },
  async rewrites() {

    return [
      {
        source: '/api/cart/:path*',
        destination: `${process.env.API_BASE}/weblinker/cart/:path*`
      },
      {
        source: '/api/search/:path*',
        destination: `${process.env.API_BASE}/weblinker/products/:path*`
      }
    ]
  }
};

export default nextConfig;
