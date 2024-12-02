import React, { useEffect, useState } from 'react';
import { storyblokEditable, getStoryblokApi, StoryblokComponent } from '@storyblok/react';
import styled from '@emotion/styled';
import { Stack, ContentContainer } from '@/src/components/atoms';

export const Footer = () => {
    const [footerContent, setFooterContent] = useState<any>(null);

    useEffect(() => {
        const fetchFooterStory = async () => {
            const storyblokApi = getStoryblokApi();
            const { data } = await storyblokApi.get('cdn/stories/footer'); // Fetch the footer story
            setFooterContent(data?.story?.content);
        };

        fetchFooterStory();
    }, []);

    return (
        <FooterWrapper>
            {/*<ContentContainer>*/}
                {footerContent && (
                    <StoryblokComponent blok={footerContent} {...storyblokEditable(footerContent)} />
                )}
            {/*</ContentContainer>*/}
        </FooterWrapper>
    );
};

const FooterWrapper = styled.footer`
    width: 100%;
    // background-color: ${({ theme }) => theme.background.secondary};
    //padding: 3rem 0;
`;

// export default Footer;
