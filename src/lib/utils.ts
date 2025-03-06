import { GetServerSidePropsContext } from 'next';
import { DEFAULT_CHANNEL, DEFAULT_CHANNEL_SLUG, DEFAULT_LOCALE } from '@/src/lib/consts';
import { ContextModel } from '@/src/lib/getStatic';
import { fetchChannels } from './channels';


export const getContext = async (
    ctx: ContextModel | GetServerSidePropsContext
): Promise<ContextModel> => {
    // Grab the channel param and locale param from the route.
    // Note: channel param might actually be a locale if it's "nl" or "en"
    let channelSlug = ctx.params?.channel ?? DEFAULT_CHANNEL_SLUG;
    let locale = ctx.params?.locale as string | string[] | undefined;

    console.log("Initial channel param:", channelSlug);
    console.log("Initial locale param:", locale);

    // If the channel param is "nl" or "en", then it's actually the locale.
    if (channelSlug === 'nl' || channelSlug === 'en') {
        // If no explicit locale is provided, use the channel param as locale.
        if (!locale) {
            locale = channelSlug;
        }
        // Override channel to the default channel.
        channelSlug = DEFAULT_CHANNEL;
    }

    // Fetch dynamic channels from your backend
    const dynamicChannels = await fetchChannels();

    // If the provided channelSlug does not exist in the dynamic channels, fallback to the default channel.
    const matchedChannel = dynamicChannels.find((c: any) => c.slug === channelSlug);
    if (!matchedChannel) {
        channelSlug = DEFAULT_CHANNEL;
    }

    // On the server, if a channel cookie exists, override channelSlug if it matches a dynamic channel.
    if ('res' in ctx && ctx.req.cookies['channel']) {
        const channelCookie = ctx.req.cookies['channel'];
        const found = dynamicChannels.find((c: any) => c.slug === channelCookie);
        if (found) {
            channelSlug = found.slug;
        }
    }

    // If no locale is provided at this point, infer it from the dynamic channel.
    if (!locale) {
        const channelObj = dynamicChannels.find((c: any) => c.slug === channelSlug);
        const inferredLocale: string =
            channelObj?.nationalLocale ||
            (channelObj?.locales?.length ? channelObj.locales[0] : DEFAULT_LOCALE);

        console.log('DEBUG (inferred):', {
            params: { channel: channelObj?.slug ?? DEFAULT_CHANNEL, locale: inferredLocale },
        });
        return { params: { channel: channelObj?.slug ?? DEFAULT_CHANNEL, locale: inferredLocale } };
    }

    // Ensure locale is a string. If it's an array, take the first element.
    const finalLocale = Array.isArray(locale) ? locale[0] : locale;

    console.log("Resolved channel:", channelSlug);
    console.log("Resolved locale:", finalLocale);
    const resolvedChannelSlug = Array.isArray(channelSlug) ? channelSlug[0] : channelSlug;
    const resolvedFinalLocale = Array.isArray(finalLocale) ? finalLocale[0] : finalLocale;

    return { params: { channel: resolvedChannelSlug, locale: resolvedFinalLocale } };
};
