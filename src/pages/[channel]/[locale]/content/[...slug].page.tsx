// pages/[channel]/[locale]/content/[...slug].tsx

import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { StoryblokComponent, SbBlokData } from "@storyblok/react";
import StoryPage from '@/src/components/pages/storyblok/index';
// import Layout from '@/src/components/Layout'; // Ensure correct import
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { channels, DEFAULT_LOCALE } from '@/src/lib/consts';
import { fetchStory, fetchNavigation, fetchRelatedArticles } from '@/src/lib/storyblok';
import { getStoryblokApi } from '@storyblok/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { arrayToTree, RootNode } from '@/src/util/arrayToTree';
import { NavigationType } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';

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
                              slug,
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
        const { data } = await fetchStoryblokStories();

        if (!data?.stories) throw new Error('No content found');

        const shippingLocales = channels.map((channel) => channel.slug); // e.g., ['en', 'nl']
        const contentLocales = ['en', 'nl']; // Content locales

        const paths: {
            params: { channel: string; locale: string; slug: string[] };
        }[] = [];

        data.stories.forEach((story: StoryItem) => {
            if (!story.full_slug.startsWith('content/')) return;

            const slugParts = story.full_slug.split('/').slice(1); // Remove 'content'

            contentLocales.forEach((contentLocale) => {
                shippingLocales.forEach((shippingLocale) => {
                    paths.push({
                        params: {
                            channel: shippingLocale,
                            locale: contentLocale,
                            slug: slugParts,
                        },
                    });
                    console.log(
                        `Generated path: /${shippingLocale}/${contentLocale}/content/${slugParts.join('/')}`
                    );
                });
            });
        });

        console.log(`Total paths generated for /[channel]/[locale]/content/[...slug]: ${paths.length}`);

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error('Error fetching content from Storyblok in getStaticPaths for /[channel]/[locale]/content/[...slug]:', error);
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

    const r = await makeStaticProps(['common', 'homepage'])(_context);
    const collections = await getCollections(r.context);
    const { navigation, subnavigation } = await getNavigationTree(
        r.context,
        collections
    );
    const { channel, locale } = context.params as {
        channel: string;
        locale: string;
        slug?: string[];
    };

    // Debugging: Log received parameters
    console.log('Parameters received in getStaticProps for /[channel]/[locale]/content/[...slug]:', {
        channel,
        locale,
        slug,
    });

    if (!channel || !locale || !slug) {
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
            revalidate: process.env.NEXT_REVALIDATE ? parseInt(process.env.NEXT_REVALIDATE) : 1,
        };
    } catch (error) {
        console.error('Error fetching Storyblok data in getStaticProps for /[channel]/[locale]/content/[...slug]:', error);
        return { notFound: true };
    }
};
