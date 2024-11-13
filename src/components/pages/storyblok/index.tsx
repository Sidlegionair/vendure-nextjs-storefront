import React from 'react';
import { InferGetStaticPropsType } from 'next';
// import type { getStaticProps } from '@/src/components/pages/storyblok';
import { Layout } from '@/src/layouts';
import Head from 'next/head';
import { StoryblokComponent } from "@storyblok/react";
import { getStaticProps } from '@/src/pages/stories/[...slug].page';

const StoryPage = ({ story, relatedArticles, navigation, categories, articleGridProps }: InferGetStaticPropsType<typeof getStaticProps>) => {
    console.log("Story received in StoryPage:", story);

    // console.log()
    if (!story || !story.content) {
        console.warn("Story content is missing or incorrectly structured");
        return (
            <Layout navigation={navigation} categories={categories} pageTitle="Story not found">
                <div>Story not found</div>
            </Layout>
        );
    }

    return (
        <Layout navigation={navigation} categories={categories} pageTitle={story.name}>
            <Head>
                <title>{story.name || 'Boardrush'}</title>
            </Head>

            {/* Dynamically render the correct component based on `story.content.component` */}
            <StoryblokComponent blok={story.content} articles={relatedArticles}/>
        </Layout>
    );
};

export default StoryPage;
