/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        domains: ['localhost'],
        unoptimized: true
    },
    // webpack: (config) => {
    //     config.resolve.alias.canvas = false;
    //     return config;
    // }
};

module.exports = nextConfig;
