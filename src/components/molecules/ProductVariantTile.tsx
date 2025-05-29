import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Stack, Price, Link, TP } from '@/src/components/atoms';
import { Button } from './Button';
import { Ratings } from './Ratings';
import { CurrencyCode } from '@/src/zeus';
import { useTheme } from '@emotion/react';
import { optimizeImage } from '@/src/util/optimizeImage';
import { FacetValueType, ProductCustomFields } from '@/src/types/product';

interface ProductVariantTileProps {
    variant: {
        id: string;
        name: string;
        product: {
            slug: string;
            featuredAsset?: { preview: string };
            customFields?: ProductCustomFields;
            facetValues?: FacetValueType[];
        };
        featuredAsset?: { preview: string };
        priceWithTax: number;
        currencyCode: CurrencyCode;
    };
    addToCart?: { text: string; action: (id: string) => Promise<void> };
    withoutRatings?: boolean;
    withoutRedirect?: boolean;
    lazy?: boolean;
}

export const ProductVariantTile: React.FC<ProductVariantTileProps> = ({
    variant,
    addToCart,
    withoutRatings = false,
    withoutRedirect = false,
}) => {
    useTheme(); // Theme is used in styled components
    const [rating, setRating] = useState<number | null>(null);
    const src = variant?.featuredAsset?.preview ?? variant?.product?.featuredAsset?.preview;
    const ImageLink = withoutRedirect ? ImageContainer : LinkContainer;
    const TextWrapper = withoutRedirect ? TextContainer : TextRedirectContainer;

    // Only include facets with these codes
    const includedFacetCodes = ['terrain', 'rider-level'];

    // Define the desired order for facets
    const facetOrder = ['terrain', 'rider-level'];

    const facets: FacetValueType[] = (
        variant.product.facetValues
            ?.filter(facet => facet.facet?.code && includedFacetCodes.includes(facet.facet?.code))
            .reduce<FacetValueType[]>((unique, facet) => {
                if (!unique.some(item => item.code === facet.code)) {
                    unique.push(facet);
                }
                return unique;
            }, []) || []
    )
        // Sort facets based on the predefined order
        .sort((a, b) => {
            const aCode = a.facet?.code || '';
            const bCode = b.facet?.code || '';
            return facetOrder.indexOf(aCode) - facetOrder.indexOf(bCode);
        })
        .slice(0, 3);

    console.log(facets);

    useEffect(() => {
        if (!withoutRatings) {
            // Example: generate a random rating between 1 and 5
            const generatedRating = Math.floor(Math.random() * 5) + 1;
            setRating(generatedRating);
        }
    }, [withoutRatings]);

    // Optional: Function to get optimized image src
    const getOptimizedSrc = (src: string | undefined) => {
        // Add any image optimization logic if needed
        return src;
    };

    return (
        <TileContainer>
            <Link href={`/snowboards/${variant.product.slug}?variant=${variant.id}`}>
                <ProductImageWrapper src={getOptimizedSrc(src)}>
                    <ImageLink href={`/snowboards/${variant.product.slug}?variant=${variant.id}`} />
                </ProductImageWrapper>
            </Link>

            <ContentWrapper>
                <TextWrapper href={`/snowboards/${variant.product.slug}?variant=${variant.id}`}>
                    {/* Title & Brand Container */}
                    <TitleContainer>
                        <Stack column>
                            {typeof variant.product.customFields?.brand === 'string' && (
                                <BrandName>{variant.product.customFields.brand}</BrandName>
                            )}
                            <ProductName>{variant.name.toLowerCase()}</ProductName>
                        </Stack>
                    </TitleContainer>

                    {/* Facets & Ratings Container */}
                    <FacetsContainer>
                        <FacetsWrapper>
                            {!facets.some(facet => facet.facet?.code === 'rider-level') && (
                                <Facet>
                                    <FacetTitle>rider level</FacetTitle>
                                    <FacetValue>n/a</FacetValue>
                                </Facet>
                            )}
                            {facets.map(facet => (
                                <Facet key={facet.code}>
                                    <FacetTitle>{facet.facet?.name.toLowerCase()}</FacetTitle>
                                    <FacetValue>{facet.name || 'n/a'}</FacetValue>
                                </Facet>
                            ))}
                        </FacetsWrapper>
                        {!withoutRatings && rating !== null && <Ratings rating={rating} />}
                    </FacetsContainer>
                    <PriceTag price={variant.priceWithTax} currencyCode={variant.currencyCode} />
                </TextWrapper>
                {addToCart && (
                    <AddToCartButton onClick={() => addToCart.action(variant.id)}>{addToCart.text}</AddToCartButton>
                )}
            </ContentWrapper>
        </TileContainer>
    );
};

const TileContainer = styled(Stack)`
    flex-direction: column;
    //gap: 0.5rem;
    width: 100%;
`;

const ProductImageWrapper = styled.div<{ src?: string }>`
    position: relative;
    width: 100%;
    //min-height: 370px;
    border-radius: 15px;
    overflow: hidden;
    background-image: url(${({ src }) => optimizeImage({ size: 'noresize', src: src })});
    background-size: contain;
    //background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }

    min-height: 280px; /* adjust this value to suit your design */

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        min-height: 230px;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        min-height: 260px;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints['2xl']}) {
        min-height: 280px;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints['3xl']}) {
        min-height: 240px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        //height: 300px;
        //padding: 8px;
    }
`;

const ContentWrapper = styled(Stack)`
    flex: 1;
    flex-direction: column;
    gap: 1rem;
`;

const TitleContainer = styled.div`
    /* Reserve space so that the title (brand + product name) always occupies the same height */
    min-height: 50px; /* adjust this value based on your design */

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        min-height: 70px;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

const FacetsContainer = styled.div`
    /* Reserve space for facets and ratings */
    min-height: 40px; /* Adjust as needed */
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FacetsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Facet = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const FacetTitle = styled.span`
    font-weight: 700;
    text-transform: lowercase;
    color: ${({ theme }) => theme.text.main};
`;

const FacetValue = styled.span`
    font-weight: 300;
    font-size: 18px;
    color: ${({ theme }) => theme.text.main};
`;

const TextContainer = styled(Stack)`
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const TextRedirectContainer = styled(Link)`
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const BrandName = styled.h4`
    color: ${({ theme }) => theme.text.main};
`;

const ProductName = styled(TP)`
    color: ${({ theme }) => theme.text.main};
`;

const PriceTag = styled(Price)`
    color: ${({ theme }) => theme.text.main};
`;

const AddToCartButton = styled(Button)`
    width: 100%;
    max-width: 200px;
    align-self: center;
    cursor: pointer;
`;

const ImageContainer = styled(Stack)`
    position: relative;
    /* Additional styling if needed */
`;

const LinkContainer = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 370px; /* Ensures height matches the image wrapper */
    width: 100%;
`;
