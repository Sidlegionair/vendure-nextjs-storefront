import React from 'react';
import { InferGetStaticPropsType } from 'next';
import { Layout } from '@/src/layouts';
import Head from 'next/head';
import { StoryblokComponent, SbBlokData } from "@storyblok/react";
import { getStaticProps } from '@/src/pages/stories/[...slug].page';

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
                       contentBelowGrid = []
                   }: StoryPageProps) => {

    console.log("Story received in StoryPage:", story);
    console.log("Number of articles:", articles.length);
    console.log(contentAboveGrid);

    // Check if both story content and articles are missing
    if (!story?.content && articles.length === 0) {
        console.warn("Story content and articles are missing or incorrectly structured");
        return (
            <Layout navigation={navigation} categories={categories} pageTitle="Story not found">
                <div>Story not found</div>
            </Layout>
        );
    }

    return (
        <Layout navigation={navigation} subnavigation={subnavigation} categories={categories} pageTitle={story?.name || 'Boardrush'}>
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
            {articles.length > 0 && (
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

            {/* Render the main story component only if articles are not present */}
            {articles.length === 0 && story?.content && (
                <StoryblokComponent blok={story.content} articles={relatedArticles} />
            )}
        </Layout>
    );
};

export default StoryPage;
