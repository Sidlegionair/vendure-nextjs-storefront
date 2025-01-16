// next-sitemap.config.js
module.exports = {
    siteUrl: process.env.VERCEL_URL || 'http://localhost:3000', // Your website's URL
    generateRobotsTxt: true, // (Optional) Generates a robots.txt file
    sitemapSize: 7000, // Number of URLs per sitemap file
}
