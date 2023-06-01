const withTM = require("next-transpile-modules")([
  "@mui/material",
  "@mui/system"
]); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  crossOrigin: 'anonymous', 
  images: {
    
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  /*experimental: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },*/
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mui/styled-engine": "@mui/styled-engine-sc"
    };
    return config;
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  crossOrigin: 'anonymous',
  compiler: {
    styledComponents: true,
  }, 
  images: {
    
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig

