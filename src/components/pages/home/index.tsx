import styled from '@emotion/styled';
import { InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Stack } from '@/src/components/atoms';
import { CircularProductCarousel } from '@/src/components/organisms/CircularProductCarousel';
import { Layout } from '@/src/layouts';
import { StoryblokComponent, getStoryblokApi, SbBlokData } from '@storyblok/react';
import type { getStaticProps } from './props';

const Main = styled(Stack)`
    padding: 0 0 4rem 0;
    overflow: hidden;
`;

export const Home: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = props => {
    const { i18n, t } = useTranslation('homepage');
    const [storyblokSections, setStoryblokSections] = useState<SbBlokData[] | null>(null);

    useEffect(() => {
        const fetchStory = async () => {
            const storyblokApi = getStoryblokApi();
            const locale = i18n.language;
            const storySlug = locale === 'en' ? 'homepage-story' : `homepage-${locale}`;
            try {
                const { data } = await storyblokApi.get(`cdn/stories/${storySlug}`);
                // Set storyblokSections to an empty array if the body is null or undefined.
                setStoryblokSections(data?.story?.content?.body || []);
            } catch (error) {
                console.error(`Failed to fetch Storyblok content for slug: ${storySlug}`, error);
                setStoryblokSections([]); // Prevent null from causing issues in the render.
            }
        };

        fetchStory();
    }, [i18n.language]);

    return (
        <Layout
            navigation={props.navigation}
            subnavigation={props.subnavigation}
            categories={props.categories}
            pageTitle={t('seo.home')}>
            <Main w100 column gap="4rem">
                {/* Render CircularProductCarousel only if products array exists and has items */}
                {props.products && props.products.length > 0 && <CircularProductCarousel products={props.products} />}

                {/* Render the first Storyblok component only if storyblokSections exists and is not empty */}
                {storyblokSections && storyblokSections.length > 0 && (
                    <StoryblokComponent blok={storyblokSections[0]} />
                )}

                {/* Render additional Storyblok components if they exist */}
                {storyblokSections &&
                    storyblokSections.length > 1 &&
                    storyblokSections
                        .slice(1)
                        .map((section, index) => <StoryblokComponent key={index} blok={section} />)}

                {/* Uncomment and conditionally render HomePageSliders if needed */}
                {/* {props.sliders && props.sliders.length > 0 && (
                    <HomePageSliders sliders={props.sliders} seeAllText={t('see-all')} />
                )} */}
            </Main>
        </Layout>
    );
};
