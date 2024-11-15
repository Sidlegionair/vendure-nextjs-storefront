// Import necessary modules
import React from 'react';
import { InferGetStaticPropsType } from 'next';
import StoryPage from '@/src/components/pages/storyblok/index';
import { ContextModel, makeStaticProps } from '@/src/lib/getStatic';
import { getStoryblokApi } from '@storyblok/react';

// Define the type for Story items manually
interface StoryItem {
    id: string;
    name: string;
    content?: {
        featuredImage?: string;
        description?: string;
    };
    first_published_at: string;
    slug: string;
    full_slug: string;
}

const StoryPageWrapper = ({
                              context,
                              isOverview,
                              articles = [],
                              contentAboveGrid = [],
                              contentBelowGrid = [],
                              story = null, // Ensure story defaults to null
                              relatedArticles = [], // Ensure relatedArticles defaults to an empty array
                              navigation,
                              subnavigation,
                              categories,
                              articleGridProps,
                              key,
                          }: InferGetStaticPropsType<typeof getStaticProps>) => {

    return (
        <StoryPage
            story={story}
            relatedArticles={relatedArticles}
            navigation={navigation}
            subnavigation={subnavigation}
            categories={categories}
            isOverview={isOverview}
            articleGridProps={articleGridProps}
            context={context}
            key={key}
            articles={articles}
            contentAboveGrid={contentAboveGrid}
            contentBelowGrid={contentBelowGrid}
        />
    );
};

export default StoryPageWrapper;

export const getStaticPaths = async () => {
    const storyblokApi = getStoryblokApi();

    try {
        const { data } = await storyblokApi.get('cdn/stories', { version: 'draft' });
        if (!data?.stories) throw new Error('No stories found');

        const paths = data.stories.map((story: StoryItem) => ({
            params: { slug: story.full_slug.split('/') }
        }));

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error('Error fetching stories from Storyblok in getStaticPaths:', error);
        return { paths: [], fallback: 'blocking' };
    }
};

export const getStaticProps = async (ctx: ContextModel) => {
    const r = await makeStaticProps(['common', 'homepage'])(ctx);
    const storyblokApi = getStoryblokApi();
    const fullSlug = Array.isArray(ctx.params.slug) ? ctx.params.slug.join('/') : ctx.params.slug;
    const isOverview = fullSlug === 'articles';

    try {
        if (isOverview) {
            const { data } = await storyblokApi.get('cdn/stories', {
                starts_with: 'stories/articles',
                sort_by: 'published_at:desc',
                version: 'draft',
                per_page: 10,
                is_startpage: false,
            });
            const overviewContent = await storyblokApi.get('cdn/stories/stories/articles', { version: 'draft' });
            const overviewStory = overviewContent?.data?.story;

            console.log(overviewStory);

            console.log(data.stories);
            const articleGridProps = {
                component: 'article-grid',
                columns: 3,
                spacing: '1.5rem',
                articles: (data?.stories || []).map((story: StoryItem) => ({
                    component: 'article-card',
                    _uid: story.id,
                    title: story.name,
                    image: story.content?.featuredImage ?? '',
                    description: story.content?.description ?? '',
                    first_published_at: story.first_published_at,
                    link: { url: `/stories/articles/${story.slug}` },
                })),
                content_above_grid: overviewStory?.content?.content_above_grid || [],
                content_below_grid: overviewStory?.content?.content_below_grid || [],
                navigation: [{ children: [] }],
                subnavigation: [{ children: [] }],
            };

            return {
                props: {
                    ...r.props,
                    context: r.context,
                    story: null,
                    isOverview: true,
                    relatedArticles: null,
                    articles: data?.stories || [],
                    contentAboveGrid: overviewStory?.content?.content_above_grid || [],
                    contentBelowGrid: overviewStory?.content?.content_below_grid || [],
                    navigation: null,
                    subnavigation: null,
                    categories: [],
                    articleGridProps, // Add articleGridProps here for overview
                    key: 'overview', // Provide a unique key for the overview
                },
                revalidate: 3600,
            };
        } else {
            const apiSlug = fullSlug.startsWith('stories/') ? fullSlug : `stories/${fullSlug}`;
            const { data } = await storyblokApi.get(`cdn/stories/${apiSlug}`, { version: 'draft' });
            if (!data?.story) return { notFound: true };


            const relatedData = await storyblokApi.get('cdn/stories', {
                starts_with: 'stories/articles',
                sort_by: 'published_at:desc',
                version: 'draft',
                per_page: 3,
                is_startpage: false,
                excluding_ids: data.story.id,  // Join multiple IDs into a single string
            });

            return {
                props: {
                    ...r.props,
                    context: r.context,
                    story: data.story,
                    key: data.story.id,
                    isOverview: false,
                    relatedArticles: (relatedData?.data?.stories || []).map((story: StoryItem) => ({
                        component: 'article-card',
                        _uid: story.id,
                        title: story.name,
                        image: story.content?.featuredImage || '',
                        description: story.content?.description || '',
                        first_published_at: story.first_published_at,
                        link: { url: `/stories/articles/${story.slug}` },
                    })),
                    articles: [],
                    contentAboveGrid: [],
                    contentBelowGrid: [],
                    navigation: null,
                    subnavigation: null,
                    categories: [],
                    articleGridProps: null, // Set to null if not in overview
                },
                revalidate: 3600,
            };
        }
    } catch (error) {
        console.error('Error fetching Storyblok data in getStaticProps:', error);
        return { notFound: true };
    }
};
