// lib/getStatic.ts
import { i18n } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import resources from '@/src/@types/resources';
import { GetServerSidePropsContext } from 'next';
import { getContext } from './utils';
import { channels, DEFAULT_LOCALE } from '@/src/lib/consts'; // Keep your default locale constant here
import { DEFAULT_CHANNEL, DEFAULT_CHANNEL_SLUG, fetchChannels } from './channels';

export interface ContextModel<T = Record<string, string>> {
    params: { locale: string; channel: string } & T;
}

/**
 * Build a list of static paths using dynamic channels.
 */
export const getAllPossibleWithChannels = async () => {
    const dynamicChannels = await fetchChannels();
    const paths: { params: { locale: string; channel: string } }[] = [];

    // Generate paths for each dynamic channel.
    dynamicChannels.forEach((c: any) => {
        // Always include the channel's nationalLocale.
        paths.push({ params: { channel: c.slug, locale: c.nationalLocale } });
        // Add additional locales if available.
        (c.locales || [])
            .filter((l: string) => l !== c.nationalLocale)
            .forEach((locale: string) => {
                paths.push({ params: { channel: c.slug, locale } });
            });
    });

    // Fallback: Add paths for each language supported by the default channel.
    // Assume the default channel is identified by process.env.DEFAULT_CHANNEL or 'gx9ktntebrqot7t8ua'
    const defaultChannelSlug = process.env.DEFAULT_CHANNEL || 'gx9ktntebrqot7t8ua';
    const defaultChannelObj = dynamicChannels.find((c: any) => c.slug === defaultChannelSlug);
    if (defaultChannelObj && defaultChannelObj.languages) {
        defaultChannelObj.languages.forEach((lang: string) => {
            // Always add fallback path { channel: lang, locale: lang }
            // This ensures that a URL like /nl/ will be built.
            const alreadyAdded = paths.some(
                (p) => p.params.channel === lang && p.params.locale === lang
            );
            if (!alreadyAdded) {
                paths.push({ params: { channel: lang, locale: lang } });
            }
        });
    }

    console.log("Generated paths:", paths);
    return paths;
};

const getStandardLocalePaths = async () => {
    const paths: { params: { locale: string; channel: string } }[] = [];
    channels.forEach(c => {
        // Always include the national locale
        paths.push({ params: { channel: c.slug, locale: c.nationalLocale } });

        // Include additional locales, if any
        c.locales
            .filter(l => l !== c.nationalLocale)
            .forEach(locale => {
                paths.push({ params: { channel: c.slug, locale } });
            });
    });
    console.log(paths);
    return paths;
};

/**
 * Get translation props ensuring a valid locale. Uses DEFAULT_LOCALE as fallback.
 */
export async function getI18nProps(
    ctx: ContextModel,
    ns: Array<keyof typeof resources> = ['common']
) {
    const locale = ctx?.params?.locale ?? DEFAULT_LOCALE;
    if (process.env.NODE_ENV === 'development') await i18n?.reloadResources();
    const props = {
        ...(await serverSideTranslations(locale, ns)),
    };
    return props;
}

/**
 * For static generation. Note: if you switch to SSR, you can drop getStaticPaths.
 */
export function makeStaticProps(ns: Array<keyof typeof resources>) {
    return async function getStaticProps(ctx: ContextModel) {
        // Await getContext so that it resolves dynamic channels
        const context = await getContext(ctx);
        return {
            props: await getI18nProps(context, ns),
            context: context.params,
        };
    };
}

/**
 * For server-side rendering.
 */
export function makeServerSideProps(ns: Array<keyof typeof resources>) {
    return async function getServerSideProps(ctx: GetServerSidePropsContext) {
        const context = await getContext(ctx);
        return {
            props: await getI18nProps(context, ns),
            context: context.params,
        };
    };
}

/**
 * Build static paths using dynamic channels.
 */
export const getStaticPaths = async () => ({
    fallback: false,
    paths: await getStandardLocalePaths(),
});
