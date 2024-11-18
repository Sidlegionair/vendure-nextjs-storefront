import { Stack } from '@/src/components/atoms/Stack';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { ActiveOrderType, ShippingMethodType } from '@/src/graphql/selectors';
import styled from '@emotion/styled';
import React from 'react';
import { CurrencyCode } from '@/src/zeus';
import { Price } from '@/src/components/atoms';

interface Props {
    selected?: string;
    onChange: (id: string) => void;
    error?: string;
    shippingMethods: ShippingMethodType[];
    currencyCode?: ActiveOrderType['currencyCode'];
}

export const DeliveryMethod: React.FC<Props> = ({
                                                    selected,
                                                    onChange,
                                                    error,
                                                    shippingMethods,
                                                    currencyCode = CurrencyCode.USD,
                                                }) => {
    return (
        <Stack w100 column>
            <Wrapper gap="2rem">
                {shippingMethods?.map(({ id, name, price }) => (
                    <Box
                        justifyCenter
                        itemsCenter
                        w100
                        error={!!error}
                        selected={selected === id}
                        key={id}
                        column
                        onClick={() => onChange(id)}>
                        <StyledTP selected={selected === id} error={!!error}>
                            {name}
                        </StyledTP>
                        <Price price={price} currencyCode={currencyCode} />
                    </Box>
                ))}
            </Wrapper>
        </Stack>
    );
};

const Wrapper = styled(Stack)`
    margin: 1.6rem 0;
`;

const StyledTP = styled(TP)<{ selected: boolean; error: boolean }>`
    color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')};
    font-size: 1.5rem;
    font-weight: 400;
`;

const Box = styled(Stack)<{ selected: boolean; error: boolean }>`
    cursor: pointer;
    padding: 23px 0px;
    text-align: center;
    border: 1px solid ${p => (p.error ? p.theme.error : p.selected ? p.theme.gray(800) : p.theme.gray(200))};
    font-size: 16px;
    font-weight: 400;
    color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')} !important;
    background-color: ${p => (p.error ? p.theme.error : p.selected ? '#000' : '#fff')} !important;
    border-radius: 8px;
    
    &:hover {
        border: 1px solid ${p => p.theme.gray(400)};
    }

    & > div {
        color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')}; /* Adjusted color logic for div */

        & > p {
            font-size: 20px;
            font-weight: 600;
            color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')}; /* Color logic for p element */
        }
    }
`;
