import React from 'react';
import { Stack, Link, TP, ProductImage } from '@/src/components/atoms/';
import { priceFormatter } from '@/src/util/priceFormatter';
import styled from '@emotion/styled';
import { Ratings } from './Ratings';
import { CurrencyCode } from '@/src/zeus';

export const ProductTile = ({ product, lazy }) => {
    const includedFacetCodes = ['terrain', 'rider-level'];
    const facetOrder = ['rider-level', 'terrain'];

    const facets = product.facetValues
        ?.filter((facet) => includedFacetCodes.includes(facet.code))
        .reduce((unique, facet) => {
            if (!unique.some((item) => item.code === facet.code)) {
                unique.push(facet);
            }
            return unique;
        }, [])
        .sort((a, b) => facetOrder.indexOf(a.code) - facetOrder.indexOf(b.code))
        .slice(0, 3) || [];

    const priceValue = product.priceWithTax
        ? product.priceWithTax.value
            ? priceFormatter(product.priceWithTax.value, product.currencyCode as CurrencyCode)
            : product.priceWithTax.min === product.priceWithTax.max
                ? priceFormatter(product.priceWithTax.min, product.currencyCode as CurrencyCode)
                : `${priceFormatter(product.priceWithTax.min, product.currencyCode as CurrencyCode)} - ${priceFormatter(
                    product.priceWithTax.max,
                    product.currencyCode as CurrencyCode
                )}`
        : 'Price not available';

    const src = product.productAsset?.preview;
    const brand = product.customFields?.brand || undefined;

    return (
        <Main column gap="1rem">
            <Stack style={{ position: 'relative', maxWidth: '50rem' }}>
                <Link href={`/snowboards/${product.slug}/`}>
                    <ProductImage
                        loading={lazy ? 'lazy' : undefined}
                        src={src}
                        alt={product.productName}
                        title={product.productName}
                    />
                </Link>
            </Stack>
            <Stack column gap="0.75rem">
                <TextWrapper href={`/snowboards/${product.slug}/`}>
                    <Stack column gap="0.5rem">
                        {brand && (
                            <Brand size="20px" weight={700} noWrap>
                                {brand}
                            </Brand>
                        )}
                        <ProductName>{product.productName.toLowerCase()}</ProductName>
                    </Stack>
                    <Stack column gap={10}>
                        <FacetsWrapper>
                            {!facets.some((facet) => facet.code === 'rider-level') && (
                                <Facet>
                                    <FacetTitle>rider level</FacetTitle>
                                    <FacetValue>N/A</FacetValue>
                                </Facet>
                            )}
                            {facets.map((facet) => (
                                <Facet key={facet?.code}>
                                    <FacetTitle>{facet?.name.toLowerCase()}</FacetTitle>
                                    <FacetValue>{facet?.value.toLowerCase() || 'N/A'}</FacetValue>
                                </Facet>
                            ))}
                        </FacetsWrapper>
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

const Brand = styled(TP)`
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.main};
`;

const ProductName = styled(TP)`
    font-weight: 300;
    font-size: 20px;
    color: ${({ theme }) => theme.text.main};
`;

const ProductPrice = styled(Stack)`
    font-size: 1.25rem;
    font-weight: 500;
`;

const ProductPriceValue = styled(TP)`
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    color: ${({ theme }) => theme.text.main};
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

const TextWrapper = styled(Link)`
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Main = styled(Stack)`
    position: relative;
    width: fit-content;
    font-weight: 500;

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        //max-width: 35.5rem;
    }
`;
