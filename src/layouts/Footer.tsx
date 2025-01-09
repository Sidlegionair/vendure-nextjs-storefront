import React, { useEffect, useState } from 'react';
import { storyblokEditable, getStoryblokApi, StoryblokComponent } from '@storyblok/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';

export const Footer = () => {
    const { i18n } = useTranslation(); // Use i18n for locale detection
    const [footerContent, setFooterContent] = useState<any>(null);

    useEffect(() => {
        const fetchFooterStory = async () => {
            const storyblokApi = getStoryblokApi();
            const locale = i18n.language; // Get current language
            const storySlug = locale === 'en' ? 'footer' : `footer-${locale}`; // Adjust slug based on locale
            try {
                const { data } = await storyblokApi.get(`cdn/stories/${storySlug}`);
                setFooterContent(data?.story?.content);
            } catch (error) {
                console.error(`Failed to fetch Storyblok content for slug: ${storySlug}`, error);
            }
        };

        fetchFooterStory();
    }, [i18n.language]); // Re-fetch on locale change

    return (
        <FooterWrapper>
            {footerContent && (
                <StoryblokComponent blok={footerContent} {...storyblokEditable(footerContent)} />
            )}
        </FooterWrapper>
    );
};

const FooterWrapper = styled.footer`
    width: 100%;
        // background-color: ${({ theme }) => theme.background.secondary};
    //padding: 3rem 0;
`;
