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
    @media(max-width: 767px) {
        flex-direction: column;
    }
`;

const StyledTP = styled(TP)<{ selected: boolean; error: boolean }>`
    color: ${p => (p.error ? p.theme.text.white : p.selected ? p.theme.text.white : p.theme.text.main)};
    font-size: ${({ theme }) => theme.typography.fontSize.h6};
    line-height: normal;
    //font-family: "Suisse BP", sans-serif;

`;


const Box = styled(Stack)<{ selected: boolean; error: boolean }>`
    cursor: pointer;
    
    padding: 15px 25px;
    text-align: center;
    border: 1px solid ${p => (p.error ? p.theme.error : p.selected ? p.theme.background.accent : p.theme.text.main)};
    font-size: ${({ theme }) => theme.typography.fontSize.h6};
    font-weight: 400;
    color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')} !important;
    background-color: ${p => (p.error ? p.theme.error : p.selected ? p.theme.background.accent : '#fff')} !important;
    border-radius: 8px;
    
    &:hover {
        transform: scale(1.1);

        //border: 1px solid ${p => p.theme.text.main};
        background-color: ${p => p.theme.background.accent};
    }

    & > div {
        color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')}; /* Adjusted color logic for div */

        & > p {
            font-family: "Suisse BP Int'l antique", sans-serif;

            font-size: 20px;
            font-weight: 600;
            color: ${p => (p.error ? p.theme.error : p.selected ? '#fff' : '#000')}; /* Color logic for p element */
        }
    }
`;
