const fs = require('node:fs');
const path = require('node:path');
const DEFAULT_CHANNEL = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL_SLUG || 'default-channel';

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    pageExtensions: ['page.ts', 'page.tsx', 'ts', 'tsx'],
    swcMinify: true,
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'a.storyblok.com',
            },
        ],
    },
    experimental: {
        // Removed unsupported options
    },
    async rewrites() {
        return [
            // When URL is like /en/nl or /nl/en, the second segment is used.
            {
                source: '/:lang(nl|en)/:locale(nl|en)/:path*',
                destination: `/${DEFAULT_CHANNEL}/:locale/:path*`,
            },
            // Fallback for URLs like /nl or /en without a second locale segment.
            {
                source: '/:locale(nl|en)/:path*',
                destination: `/${DEFAULT_CHANNEL}/:locale/:path*`,
            },
        ];
    },

    // i18n: {
    //     locales: ['en', 'nl'], // Supported content locales
    //     defaultLocale: 'nl', // Default locale
    //     // localeDetection: false, // Disable automatic locale detection
    // },

    // async rewrites() {
    //     return [
    //         // Catch-all fallback to Storyblok for unmatched routes
    //         {
    //             source: '/:slug*',
    //             destination: '/content/:slug*', // Redirects to Storyblok's content
    //         },
    //
    //     ];
    // }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
