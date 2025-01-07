export const DEFAULT_CHANNEL = 'default-channel';
export const DEFAULT_CHANNEL_SLUG = 'en';

export const DEFAULT_LOCALE = 'en';
export const DEFAULT_NATIONAL_LOCALE = 'en';

export const channels = [
    {
        slug: DEFAULT_CHANNEL_SLUG, // 'en'
        channel: DEFAULT_CHANNEL,    // 'default-channel'
        nationalLocale: DEFAULT_NATIONAL_LOCALE, // 'en'
        locales: ['en', 'nl'],
    },

    {
        slug: 'nl',
        channel: DEFAULT_CHANNEL,    // 'default-channel'
        nationalLocale: 'nl',
        locales: ['nl', 'en'],
    },
];
