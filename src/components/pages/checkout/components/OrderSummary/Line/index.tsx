import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { TP, TypoGraphy } from '@/src/components/atoms/TypoGraphy';
import { ProductImage } from '@/src/components/atoms/ProductImage';
import { ActiveOrderType, OrderType } from '@/src/graphql/selectors';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { Price } from '@/src/components/atoms/Price';
import { useCheckout } from '@/src/state/checkout';
import { Stack } from '@/src/components/atoms/Stack';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';
import { CurrencyCode } from '@/src/zeus';
import { fetchChannels } from '@/src/lib/channels';
import { Link } from '@/src/components/atoms/Link';

interface LineProps {
    line: ActiveOrderType['lines'][number] | OrderType['lines'][number];
    isForm?: boolean;
    currencyCode?: CurrencyCode;
}

export const Line: React.FC<LineProps> = ({
                                              isForm,
                                              line: {
                                                  id,
                                                  productVariant,
                                                  quantity,
                                                  featuredAsset,
                                                  unitPriceWithTax,
                                                  linePriceWithTax,
                                                  discountedLinePriceWithTax,
                                                  customFields,
                                              },
                                              currencyCode = CurrencyCode.USD,
                                          }) => {
    const { removeFromCheckout, changeQuantity } = useCheckout();
    const { t } = useTranslation('checkout');

    // Fetch channels as in CartBody
    const [channels, setChannels] = useState<any[]>([]);
    useEffect(() => {
        async function loadChannels() {
            const channelsData = await fetchChannels();
            setChannels(channelsData);
        }
        loadChannels();
    }, []);

    // Determine the seller name based on requestedSellerChannel
    const requestedSellerChannel = customFields?.requestedSellerChannel;
    const sellerName =
        channels.find(ch => ch.slug === requestedSellerChannel)?.seller?.name ||
        'Unknown Seller';

    const brandFields = productVariant.product.customFields as { brand?: string };
    const isPriceDiscounted = linePriceWithTax !== discountedLinePriceWithTax;
    const optionInName =
        productVariant.name.replace(productVariant.product.name, '') !== '';

    return (
        <CartRow w100 justifyBetween>
            <Stack gap="2rem">
                <ProductImageWrapper>
                    <StyledProductImage
                        src={featuredAsset?.preview}
                        alt={productVariant.product.name}
                        title={productVariant.product.name}
                    />
                </ProductImageWrapper>
                <Stack column gap="18px">
                    <Stack column gap="0.125rem">
                        <Stack gap="0.5rem">
                            {brandFields?.brand && (
                                <TP size="18px" weight={700}>
                                    {brandFields.brand}
                                </TP>
                            )}
                        </Stack>
                        <Stack gap="5px">
                            <TP size="18px" weight={300} noWrap>
                                {productVariant.product.name}
                            </TP>
                            {optionInName && (
                                <TP size="18px" weight={300} noWrap>
                                    {productVariant.name.replace(productVariant.product.name, '')}
                                </TP>
                            )}
                        </Stack>
                    </Stack>
                    {isForm && (
                        <Stack column gap="18px">
                            <QuantityCounter
                                v={quantity}
                                onChange={(v: number) => changeQuantity(id, v)}
                            />
                            <Stack>
                                <Remove onClick={() => removeFromCheckout(id)}>
                                    <Trash2 size="16px" />
                                    <RemoveText weight={400} size="16px">
                                        {t('orderSummary.remove')}
                                    </RemoveText>
                                </Remove>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </Stack>
            <Stack column justifyBetween itemsEnd>
                <Price
                    inCart={true}
                    weight={500}
                    currencyCode={currencyCode}
                    price={unitPriceWithTax}
                    discountPrice={
                        isPriceDiscounted ? discountedLinePriceWithTax / quantity : undefined
                    }
                    quantity={quantity}
                />
                {/* Display the seller's name with same styling and position as in CartBody */}
                <StyledTP size="16px" weight={500}>
                    Sold by{' '}
                    <StyledLink
                        skipChannelHandling
                        href={`/content/partners/${requestedSellerChannel}`}
                    >
                        {sellerName}
                    </StyledLink>
                </StyledTP>
            </Stack>
        </CartRow>
    );
};

const StyledProductImage = styled(ProductImage)`
`

/* --- Styled Components --- */
const CartRow = styled(Stack)`

    padding: 2rem 0;
    border-bottom: 1px solid ${p => p.theme.withOpacity(p.theme.border.main, 0.3)};
`;

const ProductImageWrapper = styled.div`
    height: 125px;
    overflow: hidden;
    border-radius: 4px;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
`;

const Remove = styled.button`
    appearance: none;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    width: fit-content;
    color: ${p => p.theme.text.accent};
    gap: 0.4rem;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }
`;

const RemoveText = styled(TP)`
    color: ${p => p.theme.text.accent};
`;

/* These styles mirror the CartBody styling */
const StyledTP = styled(TP)`
    display: flex;
    gap: 5px;
    color: #bbbbbb;
`;

const StyledLink = styled(Link)`
    font-family: "Suisse BP Int'l", sans-serif;
    color: #bbbbbb;
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
        color: ${p => p.theme.text.accent};
        text-decoration: underline;
    }

    display: flex;
    align-items: start;
`;
