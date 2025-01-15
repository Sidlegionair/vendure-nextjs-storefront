import React from 'react';
import { Stack, Link, TP, ProductImage } from '@/src/components/atoms/';
import { priceFormatter } from '@/src/util/priceFormatter';
import styled from '@emotion/styled';
import { Ratings } from './Ratings';
import {
    CollectionTileType,
    ProductDetailType,
    ProductSearchType as OriginalProductSearchType,
} from '@/src/graphql/selectors';
import { CurrencyCode } from '@/src/zeus';

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

export const ProductTile: React.FC<{
    product: ProductSearchType;
    lazy?: boolean;
}> = ({ product, lazy }) => {



    const includedFacetCodes = ['terrain', 'rider-level'];

    console.log(product.facetValues, includedFacetCodes);


    // Filter and ensure unique facets by 'code'
    const facets = product.facetValues
        ?.filter((facet) => includedFacetCodes.includes(facet.code))
        .reduce((unique, facet) => {
            if (!unique.some((item) => item.code === facet.code)) {
                unique.push(facet);
            }
            return unique;
        }, [] as Array<{ code: string; name: string; value: string }>)
        .slice(0, 3) || []; // Limit to 3 facets

    console.log(product.facetValues, facets);


    function isSinglePrice(priceWithTax: any): priceWithTax is { value: number } {
        return priceWithTax && 'value' in priceWithTax;
    }

    function isPriceRange(priceWithTax: any): priceWithTax is { min: number; max: number } {
        return priceWithTax && 'min' in priceWithTax && 'max' in priceWithTax;
    }

        const priceValue = product.priceWithTax
            ? isSinglePrice(product.priceWithTax)
                ? priceFormatter(product.priceWithTax.value, product.currencyCode as CurrencyCode)
                : isPriceRange(product.priceWithTax)
                    ? product.priceWithTax.min === product.priceWithTax.max
                        ? priceFormatter(product.priceWithTax.min, product.currencyCode as CurrencyCode)
                        : `${priceFormatter(product.priceWithTax.min, product.currencyCode as CurrencyCode)} - ${priceFormatter(
                            product.priceWithTax.max,
                            product.currencyCode as CurrencyCode
                        )}`
                    : 'Price not available'
            : 'Price not available';

        // return <div>{priceValue}</div>;



    // return <div>{priceValue}</div>;

    // Get product image and brand
    const src = product.productAsset?.preview;
    const brand = product.customFields?.brand || undefined;

    return (
        <Main column gap="1rem">
            <Stack style={{ position: 'relative', maxWidth: '32rem' }}>
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
                    <Stack gap="0.5rem">
                        {brand && (
                            <Brand size="20px" weight={700} noWrap>
                                {brand}
                            </Brand>
                        )}
                        <ProductName>{product.productName}</ProductName>
                    </Stack>
                    <Stack column gap={10}>
                        <FacetsWrapper>
                            {/* Dynamically render facets */}
                            {facets.map(facet => (
                                <Facet key={facet?.code}>
                                    <b>{facet?.name}:</b>&nbsp;{facet.value}
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

// Styled Components
const Brand = styled(TP)`
    font-size: 20px;
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.text.main};
`;

const ProductName = styled(TP)`
    font-weight: 300;
    font-size: 20px;
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
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const Facet = styled.span`
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 18px;
    /* identical to box height */

    color: #000000;

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
        max-width: 35.5rem;
    }
`;
