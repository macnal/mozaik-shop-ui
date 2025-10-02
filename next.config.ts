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
};

export default nextConfig;
