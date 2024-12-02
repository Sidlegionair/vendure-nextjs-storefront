import React, { useEffect, useState } from 'react';
import { storyblokEditable, getStoryblokApi, StoryblokComponent } from '@storyblok/react';
import styled from '@emotion/styled';

interface ProductStoryProps {
    slug: string; // Pass the slug dynamically
}

export const ProductStory: React.FC<ProductStoryProps> = ({ slug }) => {
    const [storyContent, setStoryContent] = useState<any>(null);

    useEffect(() => {
        const fetchProductStory = async () => {
            const storyblokApi = getStoryblokApi();
            try {
                const { data } = await storyblokApi.get(`cdn/stories/products/${slug}`); // Fetch product story
                setStoryContent(data?.story?.content);
            } catch (error) {
                console.error('Error fetching Storyblok content:', error);
            }
        };

        fetchProductStory();
    }, [slug]);

    return (
        <StoryWrapper>
            {storyContent && (
                <StoryblokComponent blok={storyContent} {...storyblokEditable(storyContent)} />
            )}
        </StoryWrapper>
    );
};

const StoryWrapper = styled.div`
    width: 100%;
    // margin-top: 2rem;
    // padding: 2rem;
    // background-color: ${({ theme }) => theme.gray(50)};
    // border-radius: 8px;
`;
