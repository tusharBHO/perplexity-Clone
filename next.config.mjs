// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['imgs.search.brave.com']
    },
    typescript: {
        // Allow production builds even if there are type errors
        ignoreBuildErrors: true,
    },
    eslint: {
        // Optionally, also ignore ESLint errors during builds
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
