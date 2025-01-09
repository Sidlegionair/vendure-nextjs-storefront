import styled from '@emotion/styled';
import { InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Stack, ContentContainer } from '@/src/components/atoms';
import { HomePageSliders } from '@/src/components/organisms/HomePageSliders';
import { CircularProductCarousel } from '@/src/components/organisms/CircularProductCarousel';
import { Layout } from '@/src/layouts';
import { StoryblokComponent, getStoryblokApi } from '@storyblok/react';
import type { getStaticProps } from './props';

const Main = styled(Stack)`
    padding: 0 0 4rem 0;
    overflow: hidden;
`;

export const Home: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = props => {
    const { i18n, t } = useTranslation('homepage');
    const [storyblokSections, setStoryblokSections] = useState<any[]>([]);

    useEffect(() => {
        const fetchStory = async () => {
            const storyblokApi = getStoryblokApi();
            const locale = i18n.language; // Current locale (e.g., 'nl', 'en')
            const storySlug = locale === 'en' ? 'homepage-story' : `footer-${locale}`; // Adjust based on locale
            // const storySlug = locale === 'nl' ? 'homepage-story-nl' : 'homepage-story'; // Adjust based on locale
            try {
                const { data } = await storyblokApi.get(`cdn/stories/${storySlug}`);
                setStoryblokSections(data?.story?.content?.body || []);
            } catch (error) {
                console.error(`Failed to fetch Storyblok content for slug: ${storySlug}`, error);
            }
        };

        fetchStory();
    }, [i18n.language]); // Re-fetch when the locale changes

    return (
        <Layout navigation={props.navigation} subnavigation={props.subnavigation} categories={props.categories} pageTitle={t('seo.home')}>
            <Main w100 column gap="4rem">

                {/* Default Carousel */}
                <CircularProductCarousel products={props.products} />

                {/* Inject Storyblok Content if available */}
                {storyblokSections[0] && <StoryblokComponent blok={storyblokSections[0]} />}

                {/* Default Sliders */}
                <HomePageSliders sliders={props.sliders} seeAllText={t('see-all')} />

                {/* Additional Storyblok Content */}
                {storyblokSections.slice(1).map((section, index) => (
                    <ContentContainer key={index}>
                        <StoryblokComponent blok={section} />
                    </ContentContainer>
                ))}
            </Main>
        </Layout>
    );
};
