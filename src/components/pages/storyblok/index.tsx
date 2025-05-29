import React from 'react';
import { InferGetStaticPropsType } from 'next';
import { Layout } from '@/src/layouts';
import Head from 'next/head';
import { StoryblokComponent, SbBlokData } from '@storyblok/react';
import { getStaticProps } from '@/src/pages/content/[...slug].page';

type StoryPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const StoryPage = ({
    story,
    relatedArticles,
    navigation,
    subnavigation,
    categories,
    articles = [],
    articleGridProps,
    contentAboveGrid = [],
    contentBelowGrid = [],
}: StoryPageProps) => {
    console.log('Story received in StoryPage:', story);
    console.log('Number of articles:', articles.length);
    console.log('Content above grid:', contentAboveGrid);

    const hasStoryContent = !!story?.content;
    const hasArticles = articles.length > 0;

    // Handle missing story and articles
    if (!hasStoryContent && !hasArticles) {
        console.warn('Both story content and articles are missing or incorrectly structured');
        return (
            <Layout navigation={navigation} categories={categories} pageTitle="Story not found">
                <div className="story-not-found">Story not found</div>
            </Layout>
        );
    }

    // Destructure the metatags from story.content
    const { metatags } = story?.content || {};

    // Define the type for metatags
    interface Metatags {
        title?: string;
        description?: string;
        og_title?: string;
        og_description?: string;
        og_image?: { filename?: string };
        twitter_title?: string;
        twitter_description?: string;
        twitter_image?: { filename?: string };
    }

    // Type assertion for metatags
    const typedMetatags = metatags as Metatags;

    // Extract individual meta fields
    const metaTitle = typedMetatags?.title || story?.name || 'Boardrush';
    const metaDescription = typedMetatags?.description;
    const ogTitle = typedMetatags?.og_title || metaTitle;
    const ogDescription = typedMetatags?.og_description || metaDescription;
    const ogImage = typedMetatags?.og_image?.filename;
    const twitterTitle = typedMetatags?.twitter_title || metaTitle;
    const twitterDescription = typedMetatags?.twitter_description || metaDescription;
    const twitterImage = typedMetatags?.twitter_image?.filename;

    return (
        <Layout
            navigation={navigation}
            subnavigation={subnavigation}
            categories={categories}
            pageTitle={metaTitle} // Pass SEO title into the Layout if needed
        >
            <Head>
                {/* Standard Meta Tags */}
                {metaTitle && <title>{metaTitle}</title>}
                {metaDescription && <meta name="description" content={metaDescription} />}

                {/* Open Graph Meta Tags */}
                {ogTitle && <meta property="og:title" content={ogTitle} />}
                {ogDescription && <meta property="og:description" content={ogDescription} />}
                {ogImage && <meta property="og:image" content={ogImage} />}

                {/* Twitter Card Meta Tags */}
                {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
                {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
                {twitterImage && <meta name="twitter:image" content={twitterImage} />}

                {/* Optional: Specify Twitter Card Type */}
                {(twitterTitle || twitterDescription || twitterImage) && (
                    <meta name="twitter:card" content="summary_large_image" />
                )}
            </Head>

            {/* Render Content Above Grid */}
            {contentAboveGrid.length > 0 && (
                <div className="content-above-grid">
                    {contentAboveGrid.map((blok: SbBlokData, index: number) => (
                        <StoryblokComponent key={`above-grid-${index}`} blok={blok} />
                    ))}
                </div>
            )}

            {/* Render the Grid if there are articles */}
            {hasArticles && articleGridProps && (
                <div className="article-grid">
                    <StoryblokComponent blok={articleGridProps} />
                </div>
            )}

            {/* Render Content Below Grid */}
            {contentBelowGrid.length > 0 && (
                <div className="content-below-grid">
                    {contentBelowGrid.map((blok: SbBlokData, index: number) => (
                        <StoryblokComponent key={`below-grid-${index}`} blok={blok} />
                    ))}
                </div>
            )}

            {/* Render the Main Story Component */}
            {!hasArticles && hasStoryContent && <StoryblokComponent blok={story.content} articles={relatedArticles} />}
        </Layout>
    );
};

export default StoryPage;
