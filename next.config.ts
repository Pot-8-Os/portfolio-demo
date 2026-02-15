/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Docker環境ではCMSドメインが内部IP (172.17.0.1) に解決されるため許可が必要
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.CMS_DOMAIN_PROD || 'cms.example.com',
      },
      {
        protocol: 'http',
        hostname: process.env.CMS_DOMAIN_PROD || 'cms.example.com',
      },
      {
        protocol: 'https',
        hostname: process.env.CMS_DOMAIN_DEMO || 'cms-demo.example.com',
      },
    ],
  },
};

export default nextConfig;
