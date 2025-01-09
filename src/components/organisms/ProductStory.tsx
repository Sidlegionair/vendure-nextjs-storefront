import React, { useEffect, useState } from 'react';
import { storyblokEditable, getStoryblokApi, StoryblokComponent } from '@storyblok/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';

interface ProductStoryProps {
    slug: string; // Pass the slug dynamically
}

export const ProductStory: React.FC<ProductStoryProps> = ({ slug }) => {
    const { i18n } = useTranslation(); // Use i18n for locale detection
    const [storyContent, setStoryContent] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        let isMounted = true; // To track if the component is still mounted

        const fetchProductStory = async () => {
            const storyblokApi = getStoryblokApi();
            const locale = i18n.language; // Current language
            const localizedSlug = `${locale}/snowboards/${slug}`; // Adjust slug based on locale
            try {
                const { data } = await storyblokApi.get(`cdn/stories/${localizedSlug}`);
                if (isMounted) {
                    setStoryContent(data?.story?.content || null);
                    setError(null); // Clear any previous errors
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching Storyblok content:', err);
                    console.log(localizedSlug);
                    setError('Failed to load the product story. Please try again later.');
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

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    if (!storyContent) {
        return <Message>No content available for this product.</Message>;
    }

    return (
        <StoryWrapper>
            <StoryblokComponent blok={storyContent} {...storyblokEditable(storyContent)} />
        </StoryWrapper>
    );
};

const StoryWrapper = styled.div`
    width: 100%;
    //margin-top: 2rem;
    //padding: 2rem;
    //background-color: #f9f9f9;
    //border-radius: 8px;
    //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Message = styled.p`
    text-align: center;
    font-size: 1.2rem;
    color: #555;
`;

const ErrorMessage = styled(Message)`
    color: red;
`;
