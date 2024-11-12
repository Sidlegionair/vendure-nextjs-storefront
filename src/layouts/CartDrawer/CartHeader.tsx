import { Stack } from '@/src/components/atoms/Stack';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { IconButton } from '@/src/components/molecules/Button';
import { ActiveOrderType } from '@/src/graphql/selectors';
import { useCart } from '@/src/state/cart';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

interface Props {
    activeOrder?: ActiveOrderType;
}

export const CartHeader: React.FC<Props> = ({ activeOrder }) => {
    const { t } = useTranslation('common');
    const { close } = useCart();
    return (
        <CartHeaderWrapper justifyBetween itemsCenter>
            <Stack itemsEnd gap="13px">
                <TH2>{t('your-cart')}</TH2>
                {activeOrder?.totalQuantity ? (
                    <TP style={{ color: '#4D4D4D' }}> {/* Fixed the style syntax here */}
                        ({activeOrder?.lines.length} {t('items')})
                    </TP>
                ) : null}
            </Stack>
            <IconButton onClick={close}>
                <X />
            </IconButton>
        </CartHeaderWrapper>
    );
};

const CartHeaderWrapper = styled(Stack)`
    padding: 30px;
    border-bottom: 1px solid ${p => p.theme.withOpacity(p.theme.border.main, 0.3)};
`;
