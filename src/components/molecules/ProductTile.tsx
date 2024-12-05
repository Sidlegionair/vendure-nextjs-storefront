import { Stack, Link, ProductImageGrid, TP } from '@/src/components/atoms/';
import { CollectionTileType, ProductSearchType as OriginalProductSearchType } from '@/src/graphql/selectors';
import { priceFormatter } from '@/src/util/priceFormatter';
import { Ratings } from './Ratings'; // Assuming Ratings is imported from the same path
import styled from '@emotion/styled';
import React from 'react';


type ProductSearchType = OriginalProductSearchType & {
    customFields?: {
        brand?: string; // Add the brand field
    };
};

export const ProductTile: React.FC<{
    product: ProductSearchType;
    lazy?: boolean;
}> = ({ product, lazy }) => {
    const priceValue =
        'value' in product.priceWithTax
            ? priceFormatter(product.priceWithTax.value, product.currencyCode)
            : product.priceWithTax.min === product.priceWithTax.max
                ? priceFormatter(product.priceWithTax.min, product.currencyCode)
                : `${priceFormatter(product.priceWithTax.min, product.currencyCode)} - ${priceFormatter(
                    product.priceWithTax.max,
                    product.currencyCode,
                )}`;

    const src = product.productAsset?.preview;
    const brand = typeof product.customFields?.brand === 'string' ? product.customFields.brand : undefined;

    // console.log(brand);

    return (
        <Main column gap="1rem">
            <Stack style={{ position: 'relative', width: '32rem' }}>
                <Link href={`/products/${product.slug}/`}>
                    <ProductImageGrid
                        loading={lazy ? 'lazy' : undefined}
                        src={src}
                        alt={product.productName}
                        title={product.productName}
                    />
                </Link>
            </Stack>
            <Stack column gap="0.75rem">
                <TextWrapper href={`/products/${product.slug}/`}>
                    <Stack gap="0.5rem">
                        {brand && (
                            <Brand size="20px" weight={700} noWrap>
                                {brand}
                            </Brand>
                        )}
                        <ProductName>{product.productName}</ProductName>
                    </Stack>
                    <Stack column gap="0.5rem">
                        {/* Render review stars */}
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
    font-weight: 700;
    color: ${({ theme }) => theme.text.main};
`;

const ProductName = styled(TP)`
    font-weight: 400;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text.main};
`;

const ProductPrice = styled(Stack)`
    font-size: 1.25rem;
    font-weight: 500;
`;

const ProductPriceValue = styled(TP)`
    font-weight: 400;
    font-size: 1.25rem;
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
    width: 100%;
    font-weight: 500;

    @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
        max-width: 35.5rem;
    }
`;
