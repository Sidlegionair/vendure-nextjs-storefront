import styled from '@emotion/styled';
import React, { useEffect, useState, useRef } from 'react';
import { Stack, Price, Link, TP, ProductImage, TH1 } from '@/src/components/atoms';
import { Button } from './Button';
import { Ratings } from './Ratings';
import { CurrencyCode } from '@/src/zeus';
import { useTheme } from '@emotion/react'; // Import useTheme

interface ProductVariantTileProps {
    variant: {
        id: string;
        name: string;
        product: {
            slug: string;
            featuredAsset?: { preview: string };
            customFields?: { brand?: string | unknown };
            facetValues?: Array<{
                code: string;
                id: string;
                name: string;
                facet: { name: string; code: string };
            }>;
        };
        featuredAsset?: { preview: string };
        priceWithTax: number;
        currencyCode: CurrencyCode;
    };
    addToCart?: { text: string; action: (id: string) => Promise<void> };
    lazy?: boolean;
    withoutRatings?: boolean;
    withoutRedirect?: boolean;
    displayAllCategories?: boolean;
}

export const ProductVariantTile: React.FC<ProductVariantTileProps> = ({
                                                                          variant,
                                                                          addToCart,
                                                                          lazy,
                                                                          withoutRatings = false,
                                                                          withoutRedirect,
                                                                          displayAllCategories,
                                                                      }) => {
    const theme = useTheme(); // Access the theme
    const [rating, setRating] = useState<number | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const src = variant?.featuredAsset?.preview ?? variant?.product?.featuredAsset?.preview;
    const ImageLink = withoutRedirect ? ImageContainer : LinkContainer;
    const TextWrapper = withoutRedirect ? TextContainer : TextRedirectContainer;

    // Define excluded facet codes
    const includedFacetCodes = ['terrain', 'rider-level'];

    // Filter out excluded facets
    const facets = variant.product.facetValues
        ?.filter(facet => includedFacetCodes.includes(facet.code))
        .slice(0, 3); // Limit to 3 facets

    useEffect(() => {
        if (!withoutRatings) {
            // Initialize rating on client-side only
            const generatedRating = Math.floor(Math.random() * 5) + 1; // Example: 1 to 5
            setRating(generatedRating);
        }
    }, [withoutRatings]);

    // Handle image loading (optional)
    const handleImageLoad = () => {
        // Optional: Implement any additional logic post image load
    };

    // Handle image loading errors
    const handleImageError = () => {
        if (imgRef.current) {
            imgRef.current.src = '/path/to/fallback-image.webp'; // Replace with your fallback image path
        }
    };

    // Optional: Function to get optimized image src
    const getOptimizedSrc = (src: string | undefined) => {
        // Replace with logic based on your image service
        return src;
        // return src.replace(/\.(jpg|jpeg|png)$/, '.webp');
    };

    return (
        <TileContainer>
            <ProductImageWrapper src={getOptimizedSrc(src) as string}>
                <ImageLink href={`/snowboards/${variant.product.slug}?variant=${variant.id}`} />
            </ProductImageWrapper>
            <ContentWrapper>
                <TextWrapper href={`/snowboards/${variant.product.slug}?variant=${variant.id}`}>
                    <Stack gap="7px">
                        {typeof variant.product.customFields?.brand === 'string' && (
                            <BrandName size="18px" weight={700} noWrap>
                                {variant.product.customFields.brand}
                            </BrandName>
                        )}
                        <ProductName size="16px" lineHeight="20px" weight={300}>
                            {variant.name}
                        </ProductName>
                    </Stack>
                    <Stack column gap="10px">
                        {/* Render facets here */}
                        {facets && facets.length > 0 && (
                            <FacetsWrapper>
                                {facets.map(facet => (
                                    <Facet key={facet.id}>
                                        <b>{facet.facet.name}</b>&nbsp;{facet.name}
                                    </Facet>
                                ))}
                            </FacetsWrapper>
                        )}
                        {!withoutRatings && rating !== null && <Ratings rating={rating} />}
                    </Stack>
                    <PriceTag size="20px" price={variant.priceWithTax} currencyCode={variant.currencyCode} />
                </TextWrapper>
                {addToCart ? (
                    <AddToCartButton onClick={() => addToCart.action(variant.id)}>
                        {addToCart.text}
                    </AddToCartButton>
                ) : null}
            </ContentWrapper>
        </TileContainer>
    );
};

// Styled Components

const TileContainer = styled(Stack)`
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const ProductImageWrapper = styled.div<{ src: string }>`
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 370px;
    //max-height: 370px;
    border-radius: 15px;
    overflow: hidden;
    background-image: url(${({ src }) => src});
    background-size: contain; /* Ensure the image fits within the container */
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Prevent tiling */
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        height: 300px; /* Adjust for smaller screens */
        padding: 8px;
    }
`;

const ContentWrapper = styled(Stack)`
    flex: 1;
    flex-direction: column; /* Changed to column for vertical alignment */
    gap: 1rem;
`;

const FacetsWrapper = styled(Stack)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

const Facet = styled(TP)`
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 18px;

    b {
        font-weight: 600;
    }

    color: ${({ theme }) => theme.text.main};
`;

const TextContainer = styled(Stack)`
    margin-top: 0.75rem;
    display: flex;
    gap: 20px;
    flex-direction: column;
`;

const TextRedirectContainer = styled(Link)`
    margin-top: 0.75rem;
    display: flex;
    gap: 20px;
    flex-direction: column;
`;

const ImageContainer = styled(Stack)`
    position: relative;
    //max-height: 100%;

`;

const LinkContainer = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 370px; /* Ensure height matches the wrapper */
    width: 100%; /* Ensure width matches the wrapper */
`;


const BrandName = styled(TH1)`
    color: ${({ theme }) => theme.text.main};
    font-size: 18px;
`;

const ProductName = styled(TP)`
    color: ${({ theme }) => theme.text.main};
    font-size: 16px;
`;

const PriceTag = styled(Price)`
    color: ${({ theme }) => theme.text.main};
    font-size: 20px;
`;

const AddToCartButton = styled(Button)`
    width: 100%;
    max-width: 200px;
    align-self: center;
    cursor: pointer;

    &:focus {
    }
`;
