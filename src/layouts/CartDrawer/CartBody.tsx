import React, { useEffect, useState } from 'react';
import { Price } from '@/src/components/atoms/Price';
import { Stack } from '@/src/components/atoms/Stack';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { ProductImageWithInfo } from '@/src/components/molecules/ProductImageWithInfo';
import { QuantityCounter } from '@/src/components/molecules/QuantityCounter';
import { ActiveOrderType } from '@/src/graphql/selectors';
import { useCart } from '@/src/state/cart';
import { CurrencyCode } from '@/src/zeus';
import styled from '@emotion/styled';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { fetchChannels } from '@/src/lib/channels';
import { Link } from '@/src/components/atoms/Link'
interface Props {
    activeOrder?: ActiveOrderType;
    currencyCode: CurrencyCode;
}

export const CartBody: React.FC<Props> = ({ currencyCode, activeOrder }) => {
    const { t } = useTranslation('common');
    const { setItemQuantityInCart, removeFromCart } = useCart();
    const [channels, setChannels] = useState<any[]>([]);

    useEffect(() => {
        async function loadChannels() {
            const channelsData = await fetchChannels();
            setChannels(channelsData);
        }
        // Optionally log the order lines and channels for debugging
        console.log(activeOrder?.lines);
        console.log(channels);
        loadChannels();
    }, []);

    return (
        <CartList w100 column>
            {activeOrder && activeOrder.totalQuantity > 0 ? (
                activeOrder.lines.map(
                    ({
                         productVariant,
                         id,
                         featuredAsset,
                         quantity,
                         unitPriceWithTax,
                         discountedLinePriceWithTax,
                         customFields,
                     }) => {
                        const optionInName =
                            productVariant.name.replace(productVariant.product.name, '') !== '';
                        const brandFields = productVariant.product.customFields as { brand?: string };

                        // Get the requested seller channel from customFields and find the matching channel
                        const requestedSellerChannel = customFields?.requestedSellerChannel;
                        const channel = channels.find(ch => ch.slug === requestedSellerChannel);
                        const sellerName = channel?.seller?.name || 'Unknown Seller';

                        return (
                            <CartRow w100 justifyBetween key={id}>
                                <Stack gap="2rem">
                                    <ProductImageWithInfo
                                        size="thumbnail"
                                        href={`/snowboards/${productVariant.product.slug}`}
                                        imageSrc={featuredAsset?.preview}
                                    />
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
                                                        {productVariant.name.replace(
                                                            productVariant.product.name,
                                                            ''
                                                        )}
                                                    </TP>
                                                )}
                                            </Stack>
                                        </Stack>
                                        <Stack column gap="18px">
                                            <QuantityCounter
                                                v={quantity}
                                                onChange={v => setItemQuantityInCart(id, v)}
                                            />
                                            <Stack justifyBetween>
                                                <Remove onClick={async () => await removeFromCart(id)}>
                                                    <Trash2 size="16px" />
                                                    <RemoveText weight={400} size="16px">
                                                        {t('remove')}
                                                    </RemoveText>
                                                </Remove>
                                            </Stack>

                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack column justifyBetween itemsEnd>
                                    <Price
                                        inCart={true}
                                        weight={500}
                                        currencyCode={currencyCode}
                                        price={unitPriceWithTax}
                                        discountPrice={discountedLinePriceWithTax / quantity}
                                        quantity={quantity}
                                    />
                                    {/* Display the seller's name */}
                                    <StyledTP size="16px" weight={500}>
                                        Sold by <StyledLink skipChannelHandling href={`/content/partners/${requestedSellerChannel}`}>{sellerName}</StyledLink>
                                    </StyledTP>

                                </Stack>

                            </CartRow>
                        );
                    }
                )
            ) : (
                <Stack itemsCenter justifyCenter style={{ height: '100%' }}>
                    <TP>{t('cart-empty')}</TP>
                </Stack>
            )}
        </CartList>
    );
};

const StyledTP = styled(TP)`
    display: flex;
    gap: 5px;
    color: #BBBBBB;

`

const StyledLink = styled(Link)`
    font-family: "Suisse BP Int'l", sans-serif;

    color: #BBBBBB;
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
        color: ${p => p.theme.text.accent};
        text-decoration: underline;
    }

    display: flex;
    align-items: start;
`;


const CartList = styled(Stack)`
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    ::-webkit-scrollbar {
        height: 0.8rem;
        width: 0.8rem;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: ${p => p.theme.gray(200)};
        border-radius: 1rem;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: ${p => p.theme.gray(400)};
    }
`;

const CartRow = styled(Stack)`
    padding: 2rem 0;
    border-bottom: 1px solid ${p => p.theme.withOpacity(p.theme.border.main, 0.3)};
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
`;

const RemoveText = styled(TP)`
    color: ${p => p.theme.text.accent};
`;
