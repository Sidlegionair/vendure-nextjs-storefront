import React from 'react';
import { InferGetStaticPropsType } from 'next';
import { Layout } from '@/src/layouts';
import Head from 'next/head';
import { StoryblokComponent, SbBlokData } from "@storyblok/react";
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
    console.log("Story received in StoryPage:", story);
    console.log("Number of articles:", articles.length);
    console.log("Content above grid:", contentAboveGrid);

    const hasStoryContent = !!story?.content;
    const hasArticles = articles.length > 0;

    // Handle missing story and articles
    if (!hasStoryContent && !hasArticles) {
        console.warn("Both story content and articles are missing or incorrectly structured");
        return (
            <Layout navigation={navigation} categories={categories} pageTitle="Story not found">
                <div className="story-not-found">Story not found</div>
            </Layout>
        );
    }

    return (
        <Layout
            navigation={navigation}
            subnavigation={subnavigation}
            categories={categories}
            pageTitle={story?.name || 'Boardrush'}
        >
            <Head>
                <title>{story?.name || 'Boardrush'}</title>
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
            {!hasArticles && hasStoryContent && (
                <StoryblokComponent blok={story.content} articles={relatedArticles} />
            )}
        </Layout>
    );
};

export default StoryPage;
