import React, { useEffect, useState } from 'react';
import { HomePageSlidersType } from '@/src/graphql/selectors';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Slider } from '@/src/components/organisms/Slider';
import styled from '@emotion/styled';
import { Link, Stack } from '@/src/components/atoms';
import { ProductVariantTile } from '@/src/components/molecules/ProductVariantTile';

interface BestOfI {
    sliders: HomePageSlidersType[];
    seeAllText: string;
}

export const HomePageSliders: React.FC<BestOfI> = ({ sliders, seeAllText }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !sliders?.length) return null;

    return (
        <Stack w100 column gap="6rem">
            {sliders.map(slider => {
                const { slug, parent, name, productVariants } = slider;
                const slides = productVariants?.items?.map((variant, index) => (
                    <ProductVariantTile key={index} variant={variant} lazy={index > 0} />
                ));

                if (!slides?.length) return null;

                const href =
                    parent?.slug !== '__root_collection__'
                        ? `/collections/${parent?.slug}/${slug}`
                        : `/collections/${slug}`;

                return (
                    <StyledSection key={slug}>
                        <Header>
                            <TH2>
                                {`${name} (${productVariants.totalItems})`}
                            </TH2>
                            {/*<StyledLink href={href}>*/}
                            {/*    <TP upperCase color="contrast" weight={500} style={{ letterSpacing: '0.5px' }}>*/}
                            {/*        {seeAllText}*/}
                            {/*    </TP>*/}
                            {/*</StyledLink>*/}
                        </Header>
                        <Slider height="680" slides={slides} />
                    </StyledSection>
                );
            })}
        </Stack>
    );
};

// Styled Components

const StyledSection = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const StyledLink = styled(Link)`
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.text.main};
    display: flex;
    align-items: center;
    justify-content: center;
`;

