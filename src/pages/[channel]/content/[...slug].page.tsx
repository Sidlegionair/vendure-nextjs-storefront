// pages/[channel]/content/[...slug].tsx

import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import StoryPage from '@/src/components/pages/storyblok/index';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { channels, DEFAULT_LOCALE } from '@/src/lib/consts';
import { fetchStory, fetchRelatedArticles } from '@/src/lib/storyblok';
import { getStoryblokApi } from '@storyblok/react';
import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';

// Define the StoryItem interface
interface StoryItem {
    id: string;
    name: string;
    content?: {
        [key: string]: unknown;
    };
    first_published_at: string;
    slug: string;
    full_slug: string;
}

const StoryPageWrapper = ({
    slug,
    story,
    relatedArticles,
    navigation,
    subnavigation,
    categories,
    isOverview,
    articleGridProps,
    articles,
    contentAboveGrid,
    contentBelowGrid,
    locale,
    channel,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { i18n } = useTranslation();

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
            console.log(`Language changed to: ${locale}`);
        }
    }, [locale, i18n]);

    return (
        <StoryPage
            slug={slug}
            story={story}
            relatedArticles={relatedArticles}
            navigation={navigation}
            subnavigation={subnavigation}
            categories={categories}
            isOverview={isOverview}
            articleGridProps={articleGridProps}
            articles={articles}
            contentAboveGrid={contentAboveGrid}
            contentBelowGrid={contentBelowGrid}
            locale={locale}
            channel={channel}
        />
    );
};

export default StoryPageWrapper; // Removed appWithTranslation

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const storyblokApi = getStoryblokApi();

        // Fetch all stories from Storyblok
        const { data } = await storyblokApi.get('cdn/stories', { version: 'draft' });

        if (!data?.stories) throw new Error('No content found');

        const shippingLocales = channels.map(channel => channel.slug); // e.g., ['en', 'nl']

        const paths: {
            params: { channel: string; slug: string[] };
        }[] = [];

        data.stories.forEach((story: StoryItem) => {
            if (!story.full_slug.startsWith('content/')) return;

            const slugParts = story.full_slug.split('/').slice(1); // Remove 'content'

            shippingLocales.forEach(shippingLocale => {
                paths.push({
                    params: {
                        channel: shippingLocale,
                        slug: slugParts,
                    },
                });
                console.log(`Generated path: /${shippingLocale}/content/${slugParts.join('/')}`);
            });
        });

        console.log(`Total paths generated for /[channel]/content/[...slug]: ${paths.length}`);

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error(
            'Error fetching content from Storyblok in getStaticPaths for /[channel]/content/[...slug]:',
            error,
        );
        return { paths: [], fallback: 'blocking' };
    }
};

export const getStaticProps = async (context: ContextModel<{ slug?: string[] }>) => {
    const { slug } = context.params || {};
    const lastIndexSlug = slug?.length ? slug[slug.length - 1] : '';
    const _context = {
        ...context,
        params: { ...context.params, slug: lastIndexSlug },
    };

    const r = await makeStaticProps(['common', 'collections'])(_context);
    const collections = await getCollections(r.context);
    const { navigation, subnavigation } = await getNavigationTree(r.context, collections);

    // Extract channel and slug from params
    const { channel } = context.params as {
        channel: string;
        slug?: string[];
    };

    // Since this route does not include [locale], use DEFAULT_LOCALE
    const locale = channel;

    // Debugging: Log received parameters
    console.log('Parameters received in getStaticProps for /[channel]/content/[...slug]:', {
        channel,
        locale,
        slug,
    });

    if (!channel || !slug) {
        console.log('Missing parameters:', { channel, locale, slug });
        return { notFound: true };
    }

    const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
    const fullSlug = `content/${slugPath}`; // Assuming Storyblok expects 'content/brands'

    console.log('Constructed fullSlug:', fullSlug);

    try {
        console.log('Fetching Storyblok with:', { locale, channel, fullSlug });

        // Fetch the story using the utility function
        const story = await fetchStory(locale, fullSlug);

        if (!story) {
            console.log('No story found for:', { locale, fullSlug });
            return { notFound: true };
        }

        console.log('Story found:', story.name);

        // Fetch related articles using the utility function
        const relatedArticles = await fetchRelatedArticles(locale, story.id);

        console.log(`Related articles fetched: ${relatedArticles.length}`);

        return {
            props: {
                ...r.props,
                ...r.context,
                slug: context.params?.slug,
                story,
                navigation,
                subnavigation,
                articles: [],
                contentAboveGrid: [],
                contentBelowGrid: [],
                categories: [],
                articleGridProps: null,
                relatedArticles,
                channel,
                locale: locale || DEFAULT_LOCALE,
                isOverview: false,
            },
            revalidate: process.env.NEXT_REVALIDATE ? parseInt(process.env.NEXT_REVALIDATE) : 10,
        };
    } catch (error) {
        console.error('Error fetching Storyblok data in getStaticProps for /[channel]/content/[...slug]:', error);
        return { notFound: true };
    }
};
