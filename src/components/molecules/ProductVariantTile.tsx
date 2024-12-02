import styled from '@emotion/styled';
import React from 'react';
import { Stack, Price, Link, TP, ProductImage, TH1 } from '@/src/components/atoms';
import { Button } from './Button';
import { Ratings } from './Ratings';
import { CurrencyCode } from '@/src/zeus';

interface ProductVariantTileProps {
    variant: {
        id: string;
        name: string;
        product: {
            slug: string;
            featuredAsset?: { preview: string };
            customFields?: { brand?: string | unknown };
            facetValues?: Array<{
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
    const src = variant.featuredAsset?.preview ?? variant.product.featuredAsset?.preview;
    const ImageLink = withoutRedirect ? ImageContainer : LinkContainer;
    const TextWrapper = withoutRedirect ? TextContainer : TextRedirectContainer;

// Define excluded facet codes
    const excludedFacetCodes = ['category', 'brand'];

// Filter out excluded facets
    const facets = variant.product.facetValues
        ?.filter(facet => !excludedFacetCodes.includes(facet.facet.code))
        .slice(0, 3); // Limit to 3 facets

    return (
        <Stack column key={variant.id} gap="0.5rem">
            <Stack style={{ position: 'relative', width: '32rem' }}>
                <ImageLink href={`/products/${variant.product.slug}?variant=${variant.id}`}>
                    <ProductImage
                        {...(lazy ? { lazy: true } : {})}
                        src={src}
                        size="popup"
                        alt={variant.name}
                        title={variant.name}
                    />
                </ImageLink>
            </Stack>
            <Stack column gap={20}>
                <TextWrapper href={`/products/${variant.product.slug}?variant=${variant.id}`}>
                    <Stack gap={7}>
                        {typeof variant.product.customFields?.brand === 'string' && (
                            <TH1 size="20px" weight={700} noWrap>
                                {variant.product.customFields.brand}
                            </TH1>
                        )}
                        <TP size="20px" lineHeight="20px" weight={300}>
                            {variant.name}
                        </TP>
                    </Stack>
                    <Stack column gap={10}>
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
                        {!withoutRatings && <Ratings rating={Math.random() * 5} />}
                    </Stack>
                    <Price size="24px" price={variant.priceWithTax} currencyCode={variant.currencyCode} />
                </TextWrapper>
                {addToCart ? <Button onClick={() => addToCart.action(variant.id)}>{addToCart.text}</Button> : null}
            </Stack>
        </Stack>
    );
};

// Styled components for facets
const FacetsWrapper = styled(Stack)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

const Facet = styled(TP)`
    /* Terrain: Snow */

    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 18px;
    
    b {
        font-weight: 600;
    }
    
    /* identical to box height */
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
`;

const LinkContainer = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default ProductVariantTile;
