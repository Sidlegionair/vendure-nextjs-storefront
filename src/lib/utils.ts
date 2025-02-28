import { GetServerSidePropsContext } from 'next';
import { DEFAULT_CHANNEL, DEFAULT_CHANNEL_SLUG, DEFAULT_LOCALE } from '@/src/lib/consts';
import { ContextModel } from '@/src/lib/getStatic';
import { fetchChannels } from './channels';

export const getContext = async (
    ctx: ContextModel | GetServerSidePropsContext
): Promise<ContextModel> => {
    // Start with the route param or fallback to DEFAULT_CHANNEL_SLUG
    let channelSlug = ctx.params?.channel ?? DEFAULT_CHANNEL_SLUG;
    console.log("CHANNELSLUG:", channelSlug);
    const locale = ctx.params?.locale as string;
    console.log("locale:", locale);

    // Fetch dynamic channels from your backend
    const dynamicChannels = await fetchChannels();
    console.log("dynamicChannels:", dynamicChannels);

    // If the provided channelSlug does not exist in the dynamic channels, fallback
    const matchedChannel = dynamicChannels.find((c: any) => c.slug === channelSlug);
    if (!matchedChannel) {
        // Fallback to the default channel token (e.g. "gx9ktntebrqot7t8ua")
        channelSlug = DEFAULT_CHANNEL;
    }

    // On the server, if a channel cookie exists, override channelSlug if it matches a dynamic channel
    if ('res' in ctx && ctx.req.cookies['channel']) {
        const channelCookie = ctx.req.cookies['channel'];
        const found = dynamicChannels.find((c: any) => c.slug === channelCookie);
        if (found) {
            channelSlug = found.slug;
        }
    }

    // If no locale is provided, infer it from the dynamic channel
    if (!locale) {
        const channelObj = dynamicChannels.find((c: any) => c.slug === channelSlug);
        const currentLocale =
            channelObj?.nationalLocale || (channelObj?.locales ? channelObj.locales[0] : DEFAULT_LOCALE);
        // Return the channel (using its slug) and the inferred locale or fallback

        console.log('DEBUG:', { params: { channel: channelObj?.slug ?? DEFAULT_CHANNEL, locale: currentLocale ?? DEFAULT_LOCALE }});

        return { params: { channel: channelObj?.slug ?? DEFAULT_CHANNEL, locale: currentLocale ?? DEFAULT_LOCALE } };
    }

    // When locale is provided, return it along with the resolved channel
    const channel = dynamicChannels.find((c: any) => c.slug === channelSlug)?.slug ?? DEFAULT_CHANNEL;

    console.log("channel:", channel);
    console.log("locale:", locale);
    return { params: { channel, locale } };
};
