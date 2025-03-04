import React, { PropsWithChildren, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { useCheckout } from '@/src/state/checkout';
import { Stack } from '@/src/components/atoms/Stack';
import { Divider } from '@/src/components/atoms/Divider';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Line } from './Line';
import { priceFormatter } from '@/src/util/priceFormatter';
import { CurrencyCode } from '@/src/zeus';
import { DiscountForm } from '@/src/components/molecules/DiscountForm';
import { Discounts } from '@/src/components/molecules/Discounts';

interface OrderSummaryProps {
    shipping?: React.ReactNode;
    footer?: React.ReactNode;
}

export const OrderSummary: React.FC<PropsWithChildren<OrderSummaryProps>> = ({ footer, shipping }) => {
    const { activeOrder, applyCouponCode, removeCouponCode } = useCheckout();
    const { t } = useTranslation('checkout');
    const currencyCode = activeOrder?.currencyCode ?? CurrencyCode.USD;

    // Hydration check for discount form
    const [jsEnabled, setJsEnabled] = useState(false);
    useEffect(() => {
        setJsEnabled(true);
    }, []);

    if (!activeOrder) return null;

    return (
        <SummaryContainer isForm={!!shipping}>
            <SummaryContent column gap="2.5rem">
                <Stack column gap="2.5rem">
                    <TH2 weight={600} size="2.5rem">
                        {t('orderSummary.title')}
                    </TH2>
                    <Stack column gap="1rem">
                        {activeOrder.lines.map((line) => (
                            <Line key={line.id} line={line} currencyCode={currencyCode} isForm={!!shipping} />
                        ))}
                    </Stack>

                    <Stack column gap="1rem">
                        <SummaryRow>
                            <TP size="2rem" weight={300}>
                                {t('orderSummary.subtotal')}
                            </TP>
                            <TP size="2rem" weight={300}>
                                {priceFormatter(activeOrder.subTotalWithTax ?? 0, currencyCode)}
                            </TP>
                        </SummaryRow>

                        <SummaryRow>
                            <TP size="2rem" weight={300}>
                                {t('orderSummary.shipping')}
                            </TP>
                            <TP size="2rem" weight={300}>
                                {priceFormatter(activeOrder.shippingWithTax ?? 0, currencyCode)}
                            </TP>
                        </SummaryRow>

                        {shipping && jsEnabled && (
                            <Stack column gap="2.5rem">
                                <Discounts
                                    discounts={activeOrder.discounts}
                                    currencyCode={currencyCode}
                                    removeCouponCode={removeCouponCode}
                                />
                                <DiscountFormWrapper>
                                    <DiscountForm applyCouponCode={applyCouponCode} />
                                </DiscountFormWrapper>
                            </Stack>
                        )}

                        {shipping}
                        <Divider />

                        <SummaryRow isTotal>
                            <TP size="2.5rem" weight={600}>
                                {t('orderSummary.total')}
                            </TP>
                            <TP size="2.5rem" weight={600}>
                                {priceFormatter(activeOrder.totalWithTax ?? 0, currencyCode)}
                            </TP>
                        </SummaryRow>

                        {footer}
                    </Stack>
                </Stack>
            </SummaryContent>
        </SummaryContainer>
    );
};

// Styled Components

const SummaryContainer = styled(Stack)<{ isForm?: boolean }>`
    //font-size: 18px;
    background: ${({ theme }) => theme.text.white};
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border.lightgray};
    padding: 2.5rem;
    height: fit-content;
    width: ${({ isForm }) => (isForm ? 'auto' : '100%')};
    position: ${({ isForm }) => (isForm ? 'sticky' : 'relative')};
    top: ${({ isForm }) => (isForm ? '1.5rem' : '0')};

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        min-width: 52rem;
        max-width: 52rem;
    }

    @media (max-width: 1024px) {
        width: 100%;
        position: relative;
        top: 0;
    }
`;

const SummaryContent = styled(Stack)`
  width: 100%;
`;

const SummaryRow = styled(Stack)<{ isTotal?: boolean }>`
  justify-content: space-between;
  align-items: center;
  padding: ${({ isTotal }) => (isTotal ? '1rem 0' : '0.5rem 0')};
  border-top: ${({ isTotal }) => (isTotal ? '2px solid ${({ theme }) => theme.border.lightgray}' : 'none')};
`;

const DiscountFormWrapper = styled(Stack)`
  width: 100%;
`;

export default OrderSummary;
