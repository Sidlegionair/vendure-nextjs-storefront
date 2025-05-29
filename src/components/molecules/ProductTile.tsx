import React from 'react';
import { Stack, Link, TP, ProductImage } from '@/src/components/atoms/';
import { priceFormatter } from '@/src/util/priceFormatter';
import styled from '@emotion/styled';
import { Ratings } from './Ratings';
import { CurrencyCode } from '@/src/zeus';
import { EnhancedProductType } from '@/src/types/product';

export const ProductTile: React.FC<{
    product: EnhancedProductType;
    lazy?: boolean;
}> = ({ product, lazy }) => {
    const includedFacetCodes = ['terrain', 'rider-level'];

    // Define the desired order for facets
    const facetOrder = ['rider-level', 'terrain'];

    const facets =
        product.facetValues
            ?.filter(facet => includedFacetCodes.includes(facet.code))
            .reduce(
                (unique, facet) => {
                    if (!unique.some(item => item.code === facet.code)) {
                        unique.push(facet);
                    }
                    return unique;
                },
                [] as Array<{ code: string; name: string; value?: string }>,
            )
            // Sort facets based on the predefined order
            .sort((a, b) => facetOrder.indexOf(a.code) - facetOrder.indexOf(b.code))
            .slice(0, 3) || [];

    // Define a type for the price structure
    type PriceWithTax = { value: number } | { min: number; max: number } | undefined;

    function isSinglePrice(priceWithTax: PriceWithTax): priceWithTax is { value: number } {
        return !!priceWithTax && 'value' in priceWithTax;
    }

    function isPriceRange(priceWithTax: PriceWithTax): priceWithTax is { min: number; max: number } {
        return !!priceWithTax && 'min' in priceWithTax && 'max' in priceWithTax;
    }

    const priceValue = product.priceWithTax
        ? isSinglePrice(product.priceWithTax)
            ? priceFormatter(product.priceWithTax.value, product.currencyCode as CurrencyCode)
            : isPriceRange(product.priceWithTax)
              ? product.priceWithTax.min === product.priceWithTax.max
                  ? priceFormatter(product.priceWithTax.min, product.currencyCode as CurrencyCode)
                  : `${priceFormatter(
                        product.priceWithTax.min,
                        product.currencyCode as CurrencyCode,
                    )} - ${priceFormatter(product.priceWithTax.max, product.currencyCode as CurrencyCode)}`
              : 'Price not available'
        : 'Price not available';

    const src = product.productAsset?.preview;
    const brand = product.customFields?.brand || undefined;

    return (
        <Main column gap="1rem">
            <ImageContainer>
                <Link href={`/snowboards/${product.slug}/`}>
                    <ProductImage
                        loading={lazy ? 'lazy' : undefined}
                        src={src}
                        alt={product.productName}
                        title={product.productName}
                    />
                </Link>
            </ImageContainer>
            <Stack column gap="0.75rem">
                <TextWrapper href={`/snowboards/${product.slug}/`}>
                    {/* Title and Brand container */}
                    <TitleContainer>
                        <Stack column>
                            {brand && <Brand>{brand}</Brand>}
                            <ProductName>{product.productName.toLowerCase()}</ProductName>
                        </Stack>
                    </TitleContainer>
                    {/* Facets and Ratings container */}
                    <Stack column gap={10}>
                        <FacetsContainer>
                            {!facets.some(facet => facet.code === 'rider-level') && (
                                <Facet>
                                    <FacetTitle>rider level</FacetTitle>
                                    <FacetValue>n/a</FacetValue>
                                </Facet>
                            )}
                            {facets.map(facet => (
                                <Facet key={facet.code}>
                                    <FacetTitle>{facet.name.toLowerCase()}</FacetTitle>
                                    <FacetValue>{facet.value?.toLowerCase() || 'n/a'}</FacetValue>
                                </Facet>
                            ))}
                        </FacetsContainer>
                        <Ratings rating={Math.random() * 5} />
                    </Stack>
                    <ProductPrice>
                        <ProductPriceValue>{priceValue}</ProductPriceValue>
                    </ProductPrice>
                </TextWrapper>
            </Stack>
        </Main>
    );
};

const ImageContainer = styled.div`
    background: ${({ theme }) => theme.tile.background};
    padding: 23px 14px;

    position: relative;
    //max-width: 100%;
    width: 100%;
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

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        min-height: 260px;
    }
`;

const Brand = styled.h4`
    color: ${({ theme }) => theme.text.main};
`;

const ProductName = styled.h5`
    color: ${({ theme }) => theme.text.main};
    font-weight: 300;
`;

const ProductPrice = styled(Stack)`
    font-weight: bold;
`;

const ProductPriceValue = styled(TP)`
    font-weight: 700;
    color: ${({ theme }) => theme.text.main};
`;

const FacetsContainer = styled.div`
    /* Reserve space so that every tile has the same space for facets regardless of text wrapping */
    min-height: 40px; /* adjust this value as needed */
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) and (min-width: ${({ theme }) => theme.breakpoints.sm}) {
        min-height: 100px;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        min-height: 150px;
    }
`;

const Facet = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const FacetTitle = styled.h6`
    color: ${({ theme }) => theme.text.main};
`;

const FacetValue = styled.span`
    font-weight: 300;
    font-size: 18px;
    color: ${({ theme }) => theme.text.main};
`;

const TitleContainer = styled.div`
    /* Reserve space so that the title (brand + product name) always occupies the same height */
    min-height: 50px; /* adjust this value based on your design */

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) and (min-width: ${({ theme }) => theme.breakpoints.sm}) {
        min-height: 80px;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        min-height: 70px;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

const TextWrapper = styled(Link)`
    padding: 23px 14px;

    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Main = styled(Stack)`
    position: relative;
    width: 100%;

    font-weight: 500;

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        /* max-width: 35.5rem; */
    }
`;
