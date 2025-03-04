import React from 'react';
import styled from '@emotion/styled';
import { TP, TypoGraphy } from '@/src/components/atoms/TypoGraphy';
import { ProductImage } from '@/src/components/atoms/ProductImage';
import { ActiveOrderType, OrderType } from '@/src/graphql/selectors';
import { Divider } from '@/src/components/atoms/Divider';
import { CurrencyCode } from '@/src/zeus';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { Price } from '@/src/components/atoms/Price';
import { useCheckout } from '@/src/state/checkout';
import { Stack } from '@/src/components';

interface LineProps {
    line: ActiveOrderType['lines'][number] | OrderType['lines'][number];
    isForm?: boolean;
    currencyCode?: CurrencyCode;
}

export const Line: React.FC<LineProps> = ({
                                              isForm,
                                              line: {
                                                  id,
                                                  productVariant,
                                                  quantity,
                                                  featuredAsset,
                                                  unitPriceWithTax,
                                                  linePriceWithTax,
                                                  discountedLinePriceWithTax,
                                              },
                                              currencyCode = CurrencyCode.USD,
                                          }) => {
    const { removeFromCheckout, changeQuantity } = useCheckout();
    const { t } = useTranslation('checkout');

    const customFields = productVariant.product.customFields as { brand?: string };
    const isPriceDiscounted = linePriceWithTax !== discountedLinePriceWithTax;

    return (
        <LineContainer>
            <LeftSide>
                <ProductImageWrapper>
                    <ProductImage
                        src={featuredAsset?.preview}
                        alt={productVariant.product.name}
                        title={productVariant.product.name}
                    />
                </ProductImageWrapper>
            </LeftSide>

            <RightSide>
                <TitleBlock>
                    <Stack gap="1rem">
                    {customFields?.brand && (
                        <TypoGraphy size="18px" weight={700}>
                            {customFields.brand}
                        </TypoGraphy>
                    )}
                    <TypoGraphy size="18px" weight={300}>
                        {productVariant.product.name}
                    </TypoGraphy>
                    </Stack>
                    <TP size="16px" weight={400}>
                        {t('orderSummary.quantity')}: {quantity}
                    </TP>
                </TitleBlock>

                <PriceBlock>
                    {isPriceDiscounted ? (
                        <Price
                            size="20px"
                            weight={500}
                            price={discountedLinePriceWithTax}
                            currencyCode={currencyCode}
                            quantity={1}
                        />
                    ) : (
                        <Price
                            size="20px"
                            weight={500}
                            price={unitPriceWithTax}
                            currencyCode={currencyCode}
                            quantity={1}
                        />
                    )}
                </PriceBlock>

                {isForm && (
                    <ActionsBlock>
                        <QuantityControls>
                            {quantity > 1 && (
                                <ActionButton onClick={() => changeQuantity(id, quantity - 1)}>
                                    <Minus size={16} />
                                </ActionButton>
                            )}
                            <ActionButton onClick={() => changeQuantity(id, quantity + 1)}>
                                <Plus size={16} />
                            </ActionButton>
                        </QuantityControls>
                        <RemoveButton onClick={() => removeFromCheckout(id)}>
                            <TP size="1rem">{t('orderSummary.remove')}</TP>
                            <Trash2 size={16} />
                        </RemoveButton>
                    </ActionsBlock>
                )}
            </RightSide>

            {/*<DividerStyled />*/}
        </LineContainer>
    );
};

/* --- Styled Components --- */

const LineContainer = styled.div`
    display: flex;
    gap: 2rem;
    width: 100%;
    padding-bottom: 2rem;
    justify-content: space-between;
    //align-items: flex-start; /* Keep the image aligned to top by default */
`;

const LeftSide = styled.div`
    flex: 0 0 auto; /* Image side will not shrink */
`;

const ProductImageWrapper = styled.div`
    //width: 100px; /* Adjust as needed to make the image “big” */
    height: 250px; /* Keep a square ratio or remove height for auto */
    overflow: hidden;
    border-radius: 4px;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
`;

const RightSide = styled.div`
    flex: 1; /* Take the remaining space for details & price */
    display: flex;
    flex-direction: column;
    width: 100%;
    //align-items: end;
    gap: 1rem;
`;

const TitleBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const PriceBlock = styled.div`
    /* Price alone, can add margin-top if you want spacing from TitleBlock */
`;

const ActionsBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
`;

const QuantityControls = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;
`;

const ActionButton = styled.button`
    appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
        opacity: 0.7;
    }
`;

const RemoveButton = styled.button`
    appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
    align-items: center;

    &:hover {
        opacity: 0.7;
    }
`;

const DividerStyled = styled(Divider)`
    margin-top: 2rem;
`;
