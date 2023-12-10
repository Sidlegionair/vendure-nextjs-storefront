import { Stack } from '@/src/components/atoms/Stack';
import { Divider } from '@/src/components/atoms/Divider';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import React from 'react';
import { CheckoutStatus } from '../ui/CheckoutStatus';
import { useCart } from '@/src/state/cart';
import { Line } from './Line';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { priceFormatter } from '@/src/util/priceFomatter';
export const OrderSummary = () => {
    const { t } = useTranslation('checkout');
    const { asPath } = useRouter();
    const { cart } = useCart();
    const step = asPath.includes('payment') ? 'payment' : 'shipping';

    return (
        <Stack style={{ width: '100%', position: 'sticky', top: '9.6rem', height: 'fit-content' }}>
            <Stack column gap="2rem" style={{ paddingInline: '1rem' }}>
                <CheckoutStatus step={step} />
                <TH2 size="3rem" weight={500}>
                    {t('orderSummary.title')}
                </TH2>
                <Stack column>
                    {cart?.lines.map((line, i) => <Line key={i} {...line} />)}
                    <Stack column gap="2.5rem">
                        <Stack justifyBetween>
                            <TP>{t('orderSummary.subtotal')}</TP>
                            <TP>{priceFormatter(cart?.subTotalWithTax ?? 0)}</TP>
                        </Stack>
                        <Stack justifyBetween>
                            <TP>{t('orderSummary.shipping')}</TP>
                            <TP>{priceFormatter(cart?.shipping ?? 0)}</TP>
                        </Stack>
                        {cart?.discounts.map(d => (
                            <Stack key={d.description} justifyBetween>
                                <TP>{d.description}</TP>
                                <TP>{priceFormatter(d.amountWithTax)}</TP>
                            </Stack>
                        ))}
                        <Divider />
                        <Stack justifyBetween>
                            <TP size="1.75rem" weight={600}>
                                {t('orderSummary.total')}
                            </TP>
                            <TP size="1.75rem" weight={600}>
                                {priceFormatter(cart?.totalWithTax ?? 0)}
                            </TP>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};
