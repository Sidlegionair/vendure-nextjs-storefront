const fs = require('node:fs');
const path = require('node:path');
const DEFAULT_CHANNEL = process.env.DEFAULT_CHANNEL_SLUG || 'default-channel';

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
                hostname: 'a.storyblok.com'
            },
        ]
    },
    experimental: {
        useDeploymentId: true,
        // Optionally, use with Server Actions
        useDeploymentIdServerActions: true,
    },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/:locale(nl|en)',
    //             destination: '/:locale/:locale',
    //         },
    //     ];
    // },

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
})

module.exports = withBundleAnalyzer(nextConfig)
