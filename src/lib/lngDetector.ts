import i18nextConfig from '@/next-i18next.config';
import nextLanguageDetector from 'next-language-detector';

export default nextLanguageDetector({
    supportedLngs: i18nextConfig.i18n.locales,
    fallbackLng: i18nextConfig.i18n.defaultLocale,
    cookieOptions: { path: '/', sameSite: 'strict' },
    caches: ['cookie', 'localStorage'],
});
