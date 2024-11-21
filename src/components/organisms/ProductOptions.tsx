import styled from '@emotion/styled';
import { TP, Stack } from '@/src/components/atoms';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductOptionsGroup } from '@/src/state/product/types';

interface ProductOptionsProps {
    productOptionsGroups: ProductOptionsGroup[];
    handleClick: (groupId: string, optionId: string) => void;
    addingError?: string;
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({ productOptionsGroups, handleClick, addingError }) => {
    return (
        <Stack column gap="2.5rem">
            {productOptionsGroups?.map((og, i) => {
                return og.options.length ? (
                    <StyledStack key={i} column gap="1.5rem">
                        <TP capitalize>{og.name}</TP>
                        <StyledStack gap="1rem">
                            {og.options.map((o, j) => {
                                if (og.name.includes('color') || og.name.includes('kolor')) {
                                    return (
                                        <ColorSwatch
                                            outOfStock={!(o.stockLevel > 0)}
                                            key={o.name + j}
                                            onClick={() => handleClick(og.id, o.id)}
                                            color={o.name}
                                            selected={o.isSelected}
                                        />
                                    );
                                }
                                return (
                                    <SizeSelector
                                        outOfStock={!(o.stockLevel > 0)}
                                        key={o.name + j}
                                        onClick={() => handleClick(og.id, o.id)}
                                        selected={o.isSelected}>
                                        {o.name}
                                    </SizeSelector>
                                );
                            })}
                        </StyledStack>
                    </StyledStack>
                ) : null;
            })}
            <AnimatePresence>
                {addingError && (
                    <NoVariantInfo
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}>
                        <Error size="1.25rem">{addingError}</Error>
                    </NoVariantInfo>
                )}
            </AnimatePresence>
        </Stack>
    );
};

const Error = styled(TP)`
    color: ${({ theme }) => theme.error};
`;

const NoVariantInfo = styled(motion.div)``;

const VariantButton = styled.button`
    width: 9.5rem;
    padding: 1.5rem 0;
    border: none;
    outline: 0;
`;

const ColorSwatch = styled(VariantButton)<{ color: string; outOfStock: boolean; selected: boolean }>`
    width: 3rem;
    background-color: ${p => p.color};
    outline: 1px solid ${p => p.theme.outline};
    height: 3rem;
    cursor: pointer;
    ${p => p.outOfStock && `opacity: 0.5;`}
    ${p => p.selected && `outline: 2px solid ${p.theme.gray(1000)};`}
`;

const SizeSelector = styled(VariantButton)<{ selected: boolean; outOfStock: boolean }>`
    font-family: 'Calibri', sans-serif;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    
    width: 49px;
    height: 49px;
    border-radius: 50%;
    border: 1px solid ${p => p.theme.button.front};
    color: ${p => p.theme.button.front};
    background: ${p => (p.selected ? p.theme.button.front : 'transparent')};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    ${p => p.selected && `
        color: ${p.theme.button.back};
    `}

    ${p => p.outOfStock && `
        opacity: 0.5;
        position: relative;

        ::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background: ${p.theme.button.front};
            transform: rotate(-135deg);
            top: 50%;
            left: 50%;
            transform-origin: center;
            translate: -50% -50%;
        }
    `}

    :hover {
        background: ${p => (p.selected || p.outOfStock ? null : p.theme.gray(500))};
        color: ${p => (p.selected || p.outOfStock ? null : p.theme.gray(0))};
    }
`;


const StyledStack = styled(Stack)`
    justify-content: center;
    align-items: center;
    @media (min-width: 1024px) {
        justify-content: flex-start;
        align-items: flex-start;
    }
`;
