// pages/content/[...slug].tsx

import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
    GetStaticProps,
    GetStaticPaths,
    InferGetStaticPropsType,
} from 'next';
import StoryPage from '@/src/components/pages/storyblok/index';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { DEFAULT_LOCALE, DEFAULT_CHANNEL } from '@/src/lib/consts';
import { fetchStory, fetchNavigation, fetchRelatedArticles } from '@/src/lib/storyblok';
import { getStoryblokApi } from '@storyblok/react';
import { getCollections } from '@/src/graphql/sharedQueries';
import { arrayToTree, RootNode } from '@/src/util/arrayToTree';
import { getNavigationTree } from '@/src/lib/menuConfig';

// Define the StoryItem interface
interface StoryItem {
    id: string;
    name: string;
    content?: {
        [key: string]: any;
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
        // Fetch all stories from Storyblok
        const { data } = await fetchStoryblokStories();

        if (!data?.stories) throw new Error('No content found');

        const paths: {
            params: { slug: string[] };
        }[] = [];

        data.stories.forEach((story: StoryItem) => {
            if (!story.full_slug.startsWith('content/')) return;

            const slugParts = story.full_slug.split('/').slice(1); // Remove 'content'

            // Since route does not include [channel] or [locale], generate paths based solely on slug
            paths.push({
                params: { slug: slugParts },
            });
            console.log(`Generated path: /content/${slugParts.join('/')}`);
        });

        console.log(`Total paths generated for /content/[...slug]: ${paths.length}`);

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error('Error fetching content from Storyblok in getStaticPaths for /content/[...slug]:', error);
        return { paths: [], fallback: 'blocking' };
    }
};

/**
 * Helper function to fetch all stories.
 * You can define this in storyblok.ts or another utility file.
 */
const fetchStoryblokStories = async () => {
    const storyblokApi = getStoryblokApi();
    return await storyblokApi.get('cdn/stories', { version: 'draft' });
};

export const getStaticProps = async (context: ContextModel<{ slug?: string[] }>) => {
    const { slug } = context.params || {};
    const lastIndexSlug = slug?.length ? slug[slug.length - 1] : '';
    const _context = {
        ...context,
        params: { ...context.params, slug: lastIndexSlug },
    };
    // Since this route does not include [locale] or [channel], use default values
    const locale = DEFAULT_LOCALE;
    const channel = DEFAULT_CHANNEL; // Adjust based on your DEFAULT_CHANNEL structure

    // Debugging: Log received parameters
    console.log('Parameters received in getStaticProps for /content/[...slug]:', { locale, channel, slug });

    if (!slug) {
        console.log('Missing parameters:', { locale, channel, slug });
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

        const r = await makeStaticProps(['common', 'collections'])(_context);

        const collections = await getCollections(r.context);
        const { navigation, subnavigation } = await getNavigationTree(
            r.context,
            collections
        );

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
        console.error('Error fetching Storyblok data in getStaticProps for /content/[...slug]:', error);
        return { notFound: true };
    }
};
