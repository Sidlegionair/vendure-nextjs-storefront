import React, { useEffect, useState } from 'react';
import {
    HomePageSlidersType,
    ProductDetailType,
    ProductSearchType as OriginalProductSearchType,
    ProductTileSelector,
    ProductVariantTileType,
} from '@/src/graphql/selectors';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Slider } from '@/src/components/organisms/Slider';
import styled from '@emotion/styled';
import { Link, Stack } from '@/src/components/atoms';
import { ProductTile } from '@/src/components/molecules/ProductTile';
import { ProductVariantTile } from '@/src/components/molecules/ProductVariantTile';

type ProductSearchType = OriginalProductSearchType & {
    customFields?: {
        brand?: string;
    };
    facetValues?: Array<{
        code: string;
        name: string;
        value: string;
        facet?: {
            code: string;
            name: string;
        };
    }>;
};

// Override productVariants and collection from the parent type so that
// items and totalItems can be optional.
type SliderType = Omit<Partial<HomePageSlidersType>, 'productVariants'> & {
    name?: string;
    id?: string;
    slug?: string;
    assets?: any;
    productVariants?: {
        items?: ProductVariantTileType[];
        totalItems?: number;
    };
    products?: ProductSearchType[];
    // Define collection as a nested SliderType so it can be used in variant mode.
    collection?: SliderType;
};

interface BestOfI {
    seeAllText: string;
    sliders: SliderType[];
    useVariants?: boolean;
}

export const HomePageSliders: React.FC<BestOfI> = ({
                                                       sliders,
                                                       seeAllText,
                                                       useVariants = false,
                                                   }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (useVariants) {
        // Get the collection from the first slider object.
        const collection = sliders[0]?.collection;
        if (!isMounted || !collection?.productVariants?.totalItems) return null;
        // Now we can safely reassign sliders to be an array with this collection.
        sliders = [collection];
        console.log(sliders);
    } else if (!isMounted || !sliders?.length) {
        return null;
    }

    return (
        <Stack w100 column gap="8rem">
            {sliders.map((slider) => {
                const { slug, parent, name, productVariants, products, id } = slider;
                let slides;

                if (useVariants && productVariants?.items?.length) {
                    // Render Product Variants
                    slides = productVariants.items.map((variant, index) => (
                        <ProductVariantTile key={variant.id || index} variant={variant} lazy={index > 0} />
                    ));
                } else if (products?.length) {
                    slides = products.map((product, index) => (
                        <ProductTile product={product} key={id || slug} lazy={index > 0} />
                    ));
                } else {
                    return null;
                }

                return (
                    <StyledSection key={slug}>
                        {/* Header code can be added here if needed */}
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
