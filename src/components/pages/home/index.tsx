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
    const { t } = useTranslation('homepage');
    const [storyblokSections, setStoryblokSections] = useState<any[]>([]);

    useEffect(() => {
        const fetchStory = async () => {
            const storyblokApi = getStoryblokApi();
            const { data } = await storyblokApi.get(`cdn/stories/homepage-story`); // Use your actual Storyblok story slug
            setStoryblokSections(data?.story?.content?.body || []);
        };

        fetchStory();
    }, []);




    return (
        <Layout navigation={props.navigation} categories={props.categories} subnavigation={props.subnavigation} pageTitle={t('seo.home')}>
            <Main w100 column gap="4rem">

                {/* Default Carousel */}
                <CircularProductCarousel products={props.products} />

                {/* Inject Storyblok Content if available */}
                {storyblokSections[0] && (
                    <StoryblokComponent blok={storyblokSections[0]} />
                )}

                {/*/!* Default Sliders *!/*/}
                {/*<ContentContainer>*/}
                {/*    <HomePageSliders sliders={props.sliders} seeAllText={t('see-all')} />*/}
                {/*</ContentContainer>*/}


                {/* Repeat Sliders */}
                {/*<ContentContainer>*/}
                <HomePageSliders sliders={props.sliders} seeAllText={t('see-all')} />
                {/*</ContentContainer>*/}

                {/* Additional Storyblok Content */}
                {storyblokSections[1] && (
                    // <ContentContainer>
                    <StoryblokComponent blok={storyblokSections[1]} />
                    // </ContentContainer>
                )}


                {/* More Storyblok Content if available */}
                {storyblokSections.slice(2).map((section, index) => (
                    <ContentContainer key={index}>
                        <StoryblokComponent blok={section} />
                    </ContentContainer>
                ))}

            </Main>
        </Layout>
    );
};
