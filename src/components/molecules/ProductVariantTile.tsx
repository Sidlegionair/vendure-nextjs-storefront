import styled from '@emotion/styled';
import React, { useEffect, useState, useRef } from 'react';
import { Stack, Price, Link, TP, ProductImage, TH1 } from '@/src/components/atoms';
import { Button } from './Button';
import { Ratings } from './Ratings';
import { CurrencyCode } from '@/src/zeus';
import { useTheme } from '@emotion/react';

export const ProductVariantTile = ({
                                       variant,
                                       addToCart,
                                       lazy,
                                       withoutRatings = false,
                                       withoutRedirect = false,
                                       displayAllCategories,
                                   }) => {
    const theme = useTheme();
    const [rating, setRating] = useState(null);
    const imgRef = useRef(null);
    const src = variant?.featuredAsset?.preview ?? variant?.product?.featuredAsset?.preview;
    const ImageLink = withoutRedirect ? ImageContainer : LinkContainer;
    const TextWrapper = withoutRedirect ? TextContainer : TextRedirectContainer;

    const includedFacetCodes = ['terrain', 'rider-level'];
    const facetOrder = ['terrain', 'rider-level'];

    const facets = (variant.product.facetValues
        ?.filter((facet) => includedFacetCodes.includes(facet.facet.code))
        .reduce((unique, facet) => {
            if (!unique.some((item) => item.code === facet.code)) {
                unique.push(facet);
            }
            return unique;
        }, []) || [])
        .sort((a, b) => facetOrder.indexOf(a.facet.code) - facetOrder.indexOf(b.facet.code))
        .slice(0, 3);

    useEffect(() => {
        if (!withoutRatings) {
            setRating(Math.floor(Math.random() * 5) + 1);
        }
    }, [withoutRatings]);

    const getOptimizedSrc = (src) => src;

    return (
        <TileContainer>
            <Link href={`/snowboards/${variant.product.slug}?variant=${variant.id}`}>
                <ProductImageWrapper src={getOptimizedSrc(src)}>
                    <ImageLink href={`/snowboards/${variant.product.slug}?variant=${variant.id}`} />
                </ProductImageWrapper>
            </Link>

            <ContentWrapper>
                <TextWrapper href={`/snowboards/${variant.product.slug}?variant=${variant.id}`}>
                    <Stack column gap="7px">
                        {typeof variant.product.customFields?.brand === 'string' && (
                            <BrandName>{variant.product.customFields.brand}</BrandName>
                        )}
                        <ProductName>{variant.name}</ProductName>
                    </Stack>
                    <Stack column gap="10px">
                        <FacetsWrapper>
                            {!facets.some((facet) => facet.facet.code === 'rider-level') && (
                                <Facet>
                                    <FacetTitle>rider level</FacetTitle>
                                    <FacetValue>N/A</FacetValue>
                                </Facet>
                            )}
                            {facets.map((facet) => (
                                <Facet key={facet.code}>
                                    <FacetTitle>{facet.facet.name.toLowerCase()}</FacetTitle>
                                    <FacetValue>{facet.name || 'N/A'}</FacetValue>
                                </Facet>
                            ))}
                        </FacetsWrapper>
                        {!withoutRatings && rating !== null && <Ratings rating={rating} />}
                    </Stack>
                    <PriceTag price={variant.priceWithTax} currencyCode={variant.currencyCode} />
                </TextWrapper>
                {addToCart && (
                    <AddToCartButton onClick={() => addToCart.action(variant.id)}>
                        {addToCart.text}
                    </AddToCartButton>
                )}
            </ContentWrapper>
        </TileContainer>
    );
};

const TileContainer = styled(Stack)`
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
`;

const ProductImageWrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 370px;
    border-radius: 15px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ContentWrapper = styled(Stack)`
    flex: 1;
    flex-direction: column;
    gap: 1rem;
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
`;
