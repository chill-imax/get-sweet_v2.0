/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.worldvectorlogo.com",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "www.hubspot.com",
      },
      {
        protocol: "https",
        hostname: "https://cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "nomorecopyright.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
