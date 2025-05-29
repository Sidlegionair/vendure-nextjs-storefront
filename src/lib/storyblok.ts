// src/lib/storyblok.ts

import { getStoryblokApi } from '@storyblok/react';
import { RootNode } from '@/src/util/arrayToTree';
import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';
import { CollectionTileType } from '@/src/graphql/selectors';
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
/**
 * Fetches a story from Storyblok based on locale and fullSlug.
 * @param locale - The locale (e.g., 'en', 'nl').
 * @param fullSlug - The full slug path (e.g., 'content/brands').
 * @returns The fetched story or null if not found.
 */
export const fetchStory = async (locale: string, fullSlug: string): Promise<StoryItem | null> => {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/${locale}/${fullSlug}`, { version: 'draft' });
    return data?.story || null;
};

/**
 * Fetches navigation data based on context and locale.
 * @param context - The Next.js context.
 * @param locale - The locale.
 * @returns An object containing navigation and subnavigation data.
 */

export const fetchNavigation = async (context: {
    locale: string;
    channel: string;
}): Promise<{ navigation: RootNode<CollectionTileType>; subnavigation: RootNode<CollectionTileType> }> => {
    const collections: CollectionTileType[] = await getCollections(context); // Ensure type matches

    const { navigation, subnavigation } = await getNavigationTree(context, collections);

    // const subnavigation: RootNode<CollectionTileType> = { children: [...subNavigation] };

    return { navigation, subnavigation };
};

/**
 * Fetches related articles excluding the current story.
 * @param locale - The locale.
 * @param storyId - The ID of the current story to exclude.
 * @returns An array of related articles.
 */
interface RelatedArticle {
    component: string;
    _uid: string;
    title: string;
    image: string;
    description: string;
    first_published_at: string;
    link: string;
}

export const fetchRelatedArticles = async (locale: string, storyId: string): Promise<RelatedArticle[]> => {
    const storyblokApi = getStoryblokApi();
    const relatedData = await storyblokApi.get('cdn/stories', {
        starts_with: `${locale}/content/blog`,
        sort_by: 'published_at:desc',
        version: 'draft',
        per_page: 3,
        is_startpage: false,
        excluding_ids: storyId,
    });

    const relatedArticles = (relatedData?.data?.stories || []).map((relatedStory: StoryItem) => ({
        component: 'article-card',
        _uid: relatedStory.id,
        title: relatedStory.name,
        image: relatedStory.content?.featuredImage || '',
        description: relatedStory.content?.description || '',
        first_published_at: relatedStory.first_published_at,
        link: `/${relatedStory.slug.includes('blog') ? `content/blog/${relatedStory.slug}` : relatedStory.slug}`,
    }));

    return relatedArticles;
};
