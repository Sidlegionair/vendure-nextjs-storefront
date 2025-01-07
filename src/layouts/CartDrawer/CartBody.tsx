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
import React from 'react';
// import { $ } from 'execa';

interface Props {
    activeOrder?: ActiveOrderType;
    currencyCode: CurrencyCode;
}

export const CartBody: React.FC<Props> = ({ currencyCode, activeOrder }) => {
    const { t } = useTranslation('common');
    const { setItemQuantityInCart, removeFromCart } = useCart();


    return (
        <CartList w100 column>
            {activeOrder && activeOrder.totalQuantity > 0 ? (
                activeOrder.lines.map(
                    ({ productVariant, id, featuredAsset, quantity, unitPriceWithTax, discountedLinePriceWithTax }) => {
                        const optionInName = productVariant.name.replace(productVariant.product.name, '') !== '';
                        const customFields = productVariant.product.customFields as { brand?: string }; // Casting customFields to an object with brand

                        return (
                            <CartRow w100 justifyBetween key={id}>
                                <Stack gap="2rem">
                                    <ProductImageWithInfo
                                        size="thumbnail-big"
                                        href={`/snowboards/${productVariant.product.slug}`}
                                        imageSrc={featuredAsset?.preview}
                                    />
                                    <Stack column gap={18}>
                                        <Stack column gap="0.125rem">
                                            <Stack gap="0.5rem">
                                                {customFields?.brand && (
                                                    <TP size="18px" weight={700} noWrap>
                                                        {customFields.brand}
                                                    </TP>
                                                )}

                                                <TP size="18px" weight={300} noWrap>
                                                    {productVariant.product.name}
                                                </TP>
                                            </Stack>
                                            {optionInName && (
                                                <TP size="16px" weight={200}>
                                                    {productVariant.name.replace(productVariant.product.name, '')}
                                                </TP>
                                            )}
                                        </Stack>
                                        <Stack column gap={18}>
                                            <QuantityCounter v={quantity} onChange={v => setItemQuantityInCart(id, v)} />
                                            <Remove onClick={async () => await removeFromCart(id)}>
                                                <Trash2 size={'16px'} />
                                                <RemoveText weight={400} size="16px">
                                                    {t('remove')}
                                                </RemoveText>
                                            </Remove>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Price
                                    size="20px"
                                    weight={500}
                                    currencyCode={currencyCode}
                                    price={unitPriceWithTax}
                                    discountPrice={discountedLinePriceWithTax / quantity}
                                    quantity={quantity}
                                />
                            </CartRow>
                        );
                    },
                )
            ) : (
                <Stack itemsCenter justifyCenter style={{ height: '100%' }}>
                    <TP>{t('cart-empty')}</TP>
                </Stack>
            )}
        </CartList>
    );
};

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