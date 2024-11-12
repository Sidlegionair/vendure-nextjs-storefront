const fs = require('node:fs');
const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    pageExtensions: ['page.tsx', 'page.ts'],
    swcMinify: true,
    reactStrictMode: true,
    images: {
        domains: ['a.storyblok.com'], // Allows images from Storyblok CDN
    },
};

module.exports = nextConfig;
