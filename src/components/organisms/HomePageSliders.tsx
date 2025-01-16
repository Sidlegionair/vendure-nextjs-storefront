import React, { useEffect, useState } from 'react';
import {
    HomePageSlidersType,
    ProductDetailType,
    ProductSearchType as OriginalProductSearchType,
    ProductTileSelector, ProductVariantTileType,
} from '@/src/graphql/selectors';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Slider } from '@/src/components/organisms/Slider';
import styled from '@emotion/styled';
import { Link, Stack } from '@/src/components/atoms';
import { ProductTile } from '@/src/components/molecules/ProductTile';
import { ProductVariantTile } from '@/src/components/molecules/ProductVariantTile'; // Updated import


type ProductSearchType = OriginalProductSearchType & {
    customFields?: {
        brand?: string; // Extend to include brand
    };
    facetValues?: Array<{
        code: string; // Move 'code' and 'name' directly here
        name: string;
        value: string;
        facet?: {
            code: string;
            name: string;
        };
    }>;
};


type SliderType = Partial<HomePageSlidersType> & {
    name?: string;
    id?: string;
    assets?: any; // Adjust `any` to the appropriate type if known
    productVariants?: ProductVariantTileType; // Adjust `any` to the appropriate type if known
    products?: ProductSearchType[];
}
interface BestOfI {
    sliders: SliderType[];
    seeAllText: string;
    useVariants?: boolean; // Optional prop to toggle variant usage
}

export const HomePageSliders: React.FC<BestOfI> = ({ sliders, seeAllText, useVariants = false }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !sliders?.length) return null;

    return (
        <Stack w100 column gap="6rem">
            {sliders.map(slider => {
                // console.error(slider);
                const { slug, parent, name, productVariants, products, id } = slider; // Assuming 'id' exists for unique keys

                let slides;

                if (useVariants && productVariants?.items?.length) {
                    // **Render Product Variants**
                    slides = productVariants.items.map((variant, index) => (
                        <ProductVariantTile key={variant.id || index} variant={variant} lazy={index > 0} />
                    ));
                } else if(products?.length) {
                    slides = products.map((product, index) => (
                        <ProductTile product={product} key={id || slug} lazy={index > 0} />
                    ));
                }
                else {
                    return null;
                    // **Render Product Directly**
                    // slides = [<ProductTile product={slider} key={id || slug} lazy={false} />];
                }

                // if (!slides.length) return null;

                // const href =
                //     parent?.slug !== '__root_collection__'
                //         ? `/collections/${parent.slug}/${slug}`
                //         : `/collections/${slug}`;

                return (
                    <StyledSection key={slug}>
                        {/*<Header>*/}
                        {/*    <TH2>*/}
                        {/*        {`${name} (${useVariants ? productVariants?.totalItems : 1})`}*/}
                        {/*    </TH2>*/}
                        {/*    /!* Uncomment and adjust if needed*/}
                        {/*    <StyledLink href={href}>*/}
                        {/*        <TP upperCase color="contrast" weight={500} style={{ letterSpacing: '0.5px' }}>*/}
                        {/*            {seeAllText}*/}
                        {/*        </TP>*/}
                        {/*    </StyledLink>*/}
                        {/*    *!/*/}
                        {/*</Header>*/}
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
