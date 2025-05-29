import React, { useEffect, useState } from 'react';
import { storyblokEditable, getStoryblokApi, StoryblokComponent, SbBlokData } from '@storyblok/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';

interface ProductStoryProps {
    slug: string; // Pass the slug dynamically
}

export const ProductStory: React.FC<ProductStoryProps> = ({ slug }) => {
    const { i18n } = useTranslation(); // Use i18n for locale detection
    const [storyContent, setStoryContent] = useState<SbBlokData | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    const fetchStory = async (slug: string, fallback: boolean = false) => {
        const storyblokApi = getStoryblokApi();
        const locale = i18n.language; // Current language
        const localizedSlug = fallback ? `${locale}/snowboards/fallback-story` : `${locale}/snowboards/${slug}`;
        try {
            const { data } = await storyblokApi.get(`cdn/stories/${localizedSlug}`);
            return data?.story?.content || null;
        } catch (err) {
            console.error(`Error fetching Storyblok content (${localizedSlug}):`, err);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true; // To track if the component is still mounted

        const fetchProductStory = async () => {
            try {
                const content = await fetchStory(slug);
                if (isMounted) {
                    setStoryContent(content || (await fetchStory('', true))); // Fallback to "fallback-story"
                    setError(content ? null : 'Failed to load the product story. Showing fallback content.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false); // Ensure loading state is updated
                }
            }
        };

        fetchProductStory();

        return () => {
            isMounted = false; // Cleanup
        };
    }, [slug, i18n.language]); // Re-fetch when slug or locale changes

    if (loading) {
        return <Message>Loading product story...</Message>;
    }

    if (error && !storyContent) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return storyContent ? (
        <StoryWrapper>
            <StoryblokComponent blok={storyContent} {...storyblokEditable(storyContent)} />
        </StoryWrapper>
    ) : (
        <Message>No content available for this product or fallback story.</Message>
    );
};

const StoryWrapper = styled.div`
    width: 100%;
`;

const Message = styled.p`
    text-align: center;
    font-size: 1.2rem;
    color: #555;
`;

const ErrorMessage = styled(Message)`
    color: red;
`;
