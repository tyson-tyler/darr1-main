// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "images.hdqwalls.com"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
