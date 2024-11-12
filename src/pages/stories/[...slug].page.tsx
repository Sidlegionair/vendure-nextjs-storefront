// stories/[...slug].page.tsx
import React from 'react';
import { InferGetStaticPropsType } from 'next';
import StoryPage from '@/src/components/pages/storyblok/index';
import { makeStaticProps } from '@/src/lib/getStatic';
import { getStoryblokApi } from '@storyblok/react';

/**
 * Wrapper component for the StoryPage.
 * Renders either an overview grid of articles or a single article page,
 * based on the props received from getStaticProps.
 */
const StoryPageWrapper = ({ isOverview, articles = [], contentAboveGrid = [], contentBelowGrid = [], ...props }: InferGetStaticPropsType<typeof getStaticProps>) => {
    // Define article grid properties if on the overview page
    const articleGridProps = isOverview ? {
        component: 'article-grid',
        columns: 3,
        spacing: '1.5rem',
        articles: articles.map(story => ({
            component: 'article-card',
            _uid: story.id,
            title: story.name,
            image: story.content?.featuredImage ?? '',
            description: story.content?.description ?? '',
            first_published_at: story.first_published_at,
            link: { url: `/stories/articles/${story.slug}` },
        })),
        content_above_grid: contentAboveGrid,
        content_below_grid: contentBelowGrid,
    } : null;

    // Render the overview grid or individual article page based on `isOverview`
    return <StoryPage story={isOverview ? { content: articleGridProps } : undefined} {...props} />;
};

/**
 * Fetches paths for all stories from Storyblok API for static generation.
 * Returns an array of slugs representing each story.
 */
export const getStaticPaths = async () => {
    const storyblokApi = getStoryblokApi();

    try {
        const { data } = await storyblokApi.get('cdn/stories', { version: 'draft' });
        if (!data?.stories) throw new Error('No stories found');  // Ensure stories data exists

        // Map each story to a slug array path
        const paths = data.stories.map(story => ({
            params: { slug: story.full_slug.split('/') }
        }));

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error('Error fetching stories from Storyblok in getStaticPaths:', error);
        // In case of an error, return no paths and set fallback to 'blocking'
        return { paths: [], fallback: 'blocking' };
    }
};

/**
 * Generates static props for the page based on the slug.
 * - If the page is an overview (`/stories/articles`), fetches a list of articles.
 * - If it's an individual story page, fetches the story and related articles.
 */
export const getStaticProps = async (ctx) => {
    const r = await makeStaticProps(['common', 'homepage'])(ctx);
    const storyblokApi = getStoryblokApi();
    const fullSlug = Array.isArray(ctx.params.slug) ? ctx.params.slug.join('/') : ctx.params.slug;
    const isOverview = fullSlug === 'articles';

    try {
        if (isOverview) {
            // Fetch articles for the overview page
            const { data } = await storyblokApi.get('cdn/stories', {
                starts_with: 'stories/articles',
                sort_by: 'published_at:desc',
                version: 'draft',
                per_page: 10,
                is_startpage: 0,
            });

            // Fetch additional content for the overview grid (above/below)
            const overviewContent = await storyblokApi.get('cdn/stories/stories/articles', { version: 'draft' });
            const overviewStory = overviewContent?.data?.story;

            return {
                props: {
                    ...r.props,
                    context: r.context,
                    isOverview: true,
                    articles: data?.stories || [],
                    contentAboveGrid: overviewStory?.content?.content_above_grid || [],
                    contentBelowGrid: overviewStory?.content?.content_below_grid || [],
                },
                revalidate: 3600,  // Revalidate every hour
            };
        } else {
            // Fetch individual article by fullSlug
            const apiSlug = fullSlug.startsWith('stories/') ? fullSlug : `stories/${fullSlug}`;
            const { data } = await storyblokApi.get(`cdn/stories/${apiSlug}`, { version: 'draft' });
            if (!data?.story) return { notFound: true };  // Return 404 if story not found

            // Fetch related articles for the individual article page
            const relatedData = await storyblokApi.get('cdn/stories', {
                starts_with: 'stories/articles',
                sort_by: 'published_at:desc',
                version: 'draft',
                per_page: 3,
                is_startpage: 0,
                excluding_ids: [data.story.id],
            });

            return {
                props: {
                    ...r.props,
                    context: r.context,
                    story: data.story,
                    key: data.story.id,
                    isOverview: false,
                    relatedArticles: (relatedData?.data?.stories || []).map(story => ({
                        component: 'article-card',
                        _uid: story.id,
                        title: story.name,
                        image: story.content?.featuredImage || '',
                        description: story.content?.description || '',
                        first_published_at: story.first_published_at,
                        link: { url: `/stories/articles/${story.slug}` },
                    })),
                },
                revalidate: 3600,  // Revalidate every hour
            };
        }
    } catch (error) {
        console.error('Error fetching Storyblok data in getStaticProps:', error);
        // Return 404 in case of any fetching errors
        return { notFound: true };
    }
};

export default StoryPageWrapper;
