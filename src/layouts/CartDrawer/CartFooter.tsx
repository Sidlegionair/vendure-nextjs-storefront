import { Stack } from '@/src/components/atoms/Stack';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { Button } from '@/src/components/molecules/Button';
import { DiscountForm } from '@/src/components/molecules/DiscountForm';
import { Discounts } from '@/src/components/molecules/Discounts';
import { ActiveOrderType } from '@/src/graphql/selectors';
import { usePush } from '@/src/lib/redirect';
import { useCart } from '@/src/state/cart';
import { priceFormatter } from '@/src/util/priceFormatter';
import { CurrencyCode } from '@/src/zeus';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

interface Props {
    activeOrder?: ActiveOrderType;
    currencyCode: CurrencyCode;
    discountsSum: number;
}

export const CartFooter: React.FC<Props> = ({ activeOrder, currencyCode, discountsSum }) => {
    const { t } = useTranslation('common');
    const { close, applyCouponCode, removeCouponCode } = useCart();
    const [loading, setLoading] = useState(false);
    const push = usePush();
    return (
        <CartFooterWrapper column justifyBetween gap="2.5rem" haveItems={!!activeOrder?.totalQuantity}>
            {activeOrder && activeOrder?.totalQuantity > 0 ? (
                <>
                    <Stack column itemsEnd justifyBetween>

                        <Stack column gap="1rem" style={{ padding: '1rem', width: '60%' }}>
                            <DiscountForm applyCouponCode={applyCouponCode} />
                            <Discounts
                                discounts={activeOrder.discounts}
                                removeCouponCode={removeCouponCode}
                                currencyCode={currencyCode}
                            />
                        </Stack>
                        <Stack column w100 gap="20px" style={{ padding: '1rem', width: '60%' }}>
                            <Stack column gap='14px'>
                                <Stack justifyBetween>
                                    <TP>{t('subtotal')}</TP>
                                    <TP>
                                        {priceFormatter(
                                            (activeOrder?.subTotalWithTax || 0) + discountsSum,
                                            currencyCode,
                                        )}
                                    </TP>
                                </Stack>
                                {discountsSum > 0 ? (
                                    <Stack justifyBetween>
                                        <TP weight={400} size="18px">{t('discount')}</TP>
                                        <TP weight={400} size="18px">-{priceFormatter(discountsSum, currencyCode)}</TP>
                                    </Stack>
                                ) : null}
                                <Stack justifyBetween>
                                    <TP weight={600} size="18px">{t('total')}</TP>
                                    <TP weight={600} size="18px">
                                        {priceFormatter(activeOrder?.subTotalWithTax || 0, currencyCode)}
                                    </TP>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <StyledButton
                        dark
                        loading={loading}
                        onClick={() => {
                            setLoading(true);
                            push('/checkout');
                        }}>
                        {t('proceed-to-checkout')}
                    </StyledButton>
                </>
            ) : (
                <StyledButton onClick={close}>{t('continue-shopping')}
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.87597 11.8649C7.79229 11.7783 7.74529 11.6608 7.74529 11.5384C7.74529 11.416 7.79229 11.2986 7.87597 11.2119L12.4745 6.45644L0.446822 6.45644C0.328317 6.45644 0.214667 6.40776 0.130871 6.32112C0.047076 6.23448 6.86293e-07 6.11697 6.91649e-07 5.99444C6.97005e-07 5.87191 0.047076 5.7544 0.130872 5.66776C0.214667 5.58112 0.328317 5.53244 0.446822 5.53244L12.4745 5.53244L7.87597 0.776951C7.79704 0.689372 7.75407 0.573536 7.75611 0.453847C7.75816 0.334158 7.80505 0.219962 7.88692 0.135316C7.96878 0.0506696 8.07923 0.00218349 8.19498 7.17238e-05C8.31074 -0.00204004 8.42277 0.0423874 8.50747 0.123995L13.8693 5.66796C13.953 5.75459 14 5.87201 14 5.99444C14 6.11687 13.953 6.2343 13.8693 6.32092L8.50747 11.8649C8.42369 11.9514 8.31013 12 8.19172 12C8.07331 12 7.95975 11.9514 7.87597 11.8649Z"
                            fill="white" />
                    </svg>

                </StyledButton>
            )}
        </CartFooterWrapper>
    );
};

const CartFooterWrapper = styled(Stack)<{ haveItems?: boolean }>`
    padding: 30px;
    border-top: 1px solid ${p => p.theme.gray(100)};
    height: ${p => (p.haveItems ? '30%' : 'fit-content')};
`;

const StyledButton = styled(Button)<{ dark?: boolean }>`
    appearance: none;
    border: none;
    background: ${p => (p.dark ? p.theme.background.accentGreen : p.theme.gray(0))};

    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 1.6rem 0.8rem;

    color: ${p => (p.dark ? p.theme.gray(0) : p.theme.gray(1000))};
    text-align: center;
    text-transform: capitalize;
    font-weight: 600;
    font-size: 20px;
        // border: 1px solid ${p => p.theme.gray(1000)};
    border-radius: 12px;
`;
