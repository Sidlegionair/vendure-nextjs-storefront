// next-sitemap.config.js
const fetchStoryblokPaths = async () => {
    const fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
    const token = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN; // Use your Storyblok API token

    const response = await fetch(`https://api.storyblok.com/v2/cdn/stories?token=${token}&version=published`);

    if (!response.ok) {
        console.error('Error fetching Storyblok data:', response.statusText);
        return [];
    }

    const data = await response.json();
    return data.stories.map(story => ({
        loc: `/${story.full_slug}`, // URL path
        lastmod: story.published_at || new Date().toISOString(), // Last modification date
    }));
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.VERCEL_URL || 'http://localhost:3000', // Your website's URL
    generateRobotsTxt: true, // Generates a robots.txt file
    sitemapSize: 7000, // Number of URLs per sitemap file
    additionalPaths: async config => {
        const storyblokPaths = await fetchStoryblokPaths();
        return storyblokPaths;
    },
};
