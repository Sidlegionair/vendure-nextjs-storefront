import { Stack } from '@/src/components/atoms/Stack';
import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { ActiveOrderType, ShippingMethodType } from '@/src/graphql/selectors';
import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { priceFormatter } from '@/src/util/priceFomatter';

interface Props {
    shippingMethods: ShippingMethodType[];
    shippingLines?: ActiveOrderType['shippingLines'];
    changeShippingMethod: (id: string) => void;
}

export const DeliveryMethod: React.FC<Props> = ({ shippingMethods, shippingLines, changeShippingMethod }) => {
    const { t } = useTranslation('checkout');
    return (
        <Stack column>
            <TH2>{t('deliveryMethod.title')}</TH2>
            <Stack gap="2rem" style={{ margin: '3.2rem 0' }}>
                {shippingMethods?.map(({ id, name, description, price }) => {
                    const isSelected = !!shippingLines?.find(({ shippingMethod }) => shippingMethod.id === id);
                    return (
                        <Box isSelected={isSelected} key={id} column onClick={() => changeShippingMethod(id)}>
                            <TP>{name}</TP>
                            <StyledDescription dangerouslySetInnerHTML={{ __html: description }} />
                            <TP>{priceFormatter(price)}</TP>
                        </Box>
                    );
                })}
            </Stack>
        </Stack>
    );
};

const Box = styled(Stack)<{ isSelected: boolean }>`
    cursor: pointer;
    padding: 2rem;
    border: 1px solid ${p => (p.isSelected ? p.theme.gray(800) : p.theme.gray(200))};
    border-radius: 8px;

    &:hover {
        border: 1px solid ${p => p.theme.gray(400)};
    }
`;

const StyledDescription = styled.div`
    color: #000;
    & > p {
        font-size: 1rem;
    }
`;
