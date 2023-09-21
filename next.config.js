/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactRoot: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i9.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
    ],
  },
};

module.exports = nextConfig;
