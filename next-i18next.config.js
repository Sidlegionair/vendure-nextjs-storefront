// @ts-check

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
    // Previous configuration commented out
    // i18n: {
    //     defaultLocale: 'pl',
    //     locales: ['pl', 'de', 'cz'],
    //     returnObjects: true,
    //     fallbackLng: 'pl',
    // },
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'nl'],
        returnObjects: true,
        fallbackLng: 'en',
    },
    /** To avoid issues when deploying to some paas (vercel...) */
    localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',

    reloadOnPrerender: process.env.NODE_ENV === 'development',
};
