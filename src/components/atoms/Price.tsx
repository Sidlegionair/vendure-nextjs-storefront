import { Stack } from '@/src/components/atoms/Stack';
import { BaseProps, TP } from '@/src/components/atoms/TypoGraphy';
import { priceFormatter } from '@/src/util/priceFormatter';
import { CurrencyCode } from '@/src/zeus';
import styled from '@emotion/styled';

type PriceProps = {
    price: number;
    currencyCode: CurrencyCode;
    discountPrice?: number | null;
    quantity?: number;
    inCart?: boolean;
} & Partial<BaseProps>;

export const Price: React.FC<PriceProps> = ({
                                                price,
                                                discountPrice,
                                                currencyCode,
                                                quantity = 1,
                                                size = '1.5rem',
                                                weight = 400,
                                                inCart = false,
                                            }) => {
    const differentPrices = !!(discountPrice && price * quantity !== discountPrice * quantity);
    return (
        <Stack gap="0.75rem">
            <StyledPrice size={size} weight={weight} discount={differentPrices} inCart={inCart}>
                {priceFormatter(price * quantity, currencyCode)}
            </StyledPrice>
            {differentPrices && (
                <StyledDiscountPrice weight={weight} size={size} inCart={inCart}>
                    {priceFormatter(discountPrice * quantity, currencyCode)}
                </StyledDiscountPrice>
            )}
        </Stack>
    );
};

const StyledPrice = styled(TP)<{ discount?: boolean; inCart?: boolean }>`
    color: ${p => (p.discount ? p.theme.text.accentGreen : p.theme.text.main)};
    font-size: ${p =>
            p.inCart
                    ? '20px'
                    : p.discount
                            ? p.theme.typography.fontSize.small
                            : p.theme.typography.fontSize.h4};
    font-weight: bold;
    ${p => (p.discount ? `text-decoration: line-through;` : '')}
`;

const StyledDiscountPrice = styled(TP)<{ inCart?: boolean }>`
    color: ${p => p.theme.text.accent};
    font-size: ${p => (p.inCart ? '20px' : p.theme.typography.fontSize.h4)};
`;
