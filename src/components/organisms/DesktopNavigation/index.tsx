import styled from '@emotion/styled';
import React from 'react';
import { Stack, Link, ContentContainer } from '@/src/components/atoms';
import { RootNode } from '@/src/util/arrayToTree';
import { NavigationType } from '@/src/graphql/selectors';
import { NavigationLinks } from './NavigationLinks';
import { ProductsSellout } from './ProductsSellout';
import { RelatedCollections } from './RelatedCollections';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/src/state/cart';

interface NavProps {
    navigation: RootNode<NavigationType> | null;
    gap?: number; // Restricting to number for simplicity
    isSubMenu?: boolean;
}

export const DesktopNavigation: React.FC<NavProps> = ({ navigation, gap = 50, isSubMenu = false }) => {
    const { t } = useTranslation('common');
    const { addToCart } = useCart();

    const StackComponent = isSubMenu ? SubMenuStack : DesktopStack;

    // Define the mapping for numbers to rem strings
    const gapMapping: { [key: number]: '0.125rem' | '0.25rem' | '0.5rem' | '0.75rem' | '1rem' | '1.5rem' | '1.75rem' | '2rem' | '2.5rem' } = {
        10: '0.125rem',
        20: '0.25rem',
        30: '0.5rem',
        40: '0.75rem',
        50: '1rem',
        60: '1.5rem',
        70: '1.75rem',
        80: '2rem',
        90: '2.5rem'
    };

    // Get the gap value from mapping or undefined
    const gapValue = gapMapping[gap] || undefined;

    return (
        <StackComponent itemsCenter gap={gapValue}>
            {navigation?.children.map((collection) => {
                const href = collection.id === 'none'
                    ? `/${collection.slug}`
                    : collection.parent?.slug !== '__root_collection__'
                        ? `/collections/${collection.parent?.slug}/${collection.slug}`
                        : `/collections/${collection.slug}`;

                if (!collection.children || collection.children.length === 0) {
                    return (
                        <RelativeStack w100 key={collection.name}>
                            <StyledLink href={href} isSubMenu={isSubMenu}>{collection.name}</StyledLink>
                        </RelativeStack>
                    );
                }

                return (
                    <RelativeStack w100 key={collection.name}>
                        <StyledLink href={href} isSubMenu={isSubMenu}>{collection.name}</StyledLink>
                        <AbsoluteStack w100>
                            <ContentContainer>
                                <Background w100 justifyBetween>
                                    <NavigationLinks collection={collection} />
                                    <Stack gap="1.5rem">
                                        <ProductsSellout
                                            title={t('featured-products')}
                                            addToCart={addToCart}
                                            addToCartLabel={t('add-to-cart')}
                                            collection={collection}
                                        />
                                        <RelatedCollections title={t('best-collections')} collection={collection} />
                                    </Stack>
                                </Background>
                            </ContentContainer>
                        </AbsoluteStack>
                    </RelativeStack>
                );
            })}
        </StackComponent>
    );
};

const DesktopStack = styled(Stack)<{ gap?: '0.125rem' | '0.25rem' | '0.5rem' | '0.75rem' | '1rem' | '1.5rem' | '1.75rem' | '2rem' | '2.5rem' | number }>`
    @media (max-width: ${p => p.theme.breakpoints.lg}) {
        display: none; // Hide on smaller screens
    }
    z-index: 9999;
`;

const Background = styled(Stack)`
    //left: 40vw;
    height: 100%;
    background: ${p => p.theme.background.main};
    box-shadow: 0px 0px 12px ${p => p.theme.shadow};
    border: 1px solid ${p => p.theme.gray(100)};
    margin-top: 4rem;
    padding: 40px;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        margin-top: 2rem;
        padding: 20px;
    }

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        margin-top: 1rem;
        padding: 10px;
    }
`;

const RelativeStack = styled(Stack)`
    position: relative; // Ensure stacking context
    z-index: 10;

    & > div {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        position: absolute;
        top: 100%;
        left: 17vw;
        transform: translateX(-50%) translateY(-1rem); // Initial state off-screen
        transition: all 0.35s ease-in-out;
    }

    &:hover {
        & > a {
            color: ${p => p.theme.text.main};
            text-decoration: underline;
            text-decoration-thickness: 0.1rem;
            text-underline-offset: 0.5rem;
        }
        & > div {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0); // Dropdown is visible
            pointer-events: all;
        }
    }
`;

const AbsoluteStack = styled(Stack)`
    position: absolute;
    z-index: 20;
    top: 100%;
    left: 100vw;
    transform: translateX(-50%);
    margin-top: 0;
    transition: all 0.35s ease-in-out;
    width: auto; // Dynamically adjust to content
    min-width: 200px;
    max-width: 80vw; // Responsive constraint for smaller screens
    overflow: visible;

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        left: 0;
        transform: translateX(0); // Align left for smaller screens
        max-width: 100%; // Ensure full width on small screens
    }

    &::before {
        content: '';
        position: absolute;
        top: -10px;
        left: 0;
        width: 100%;
        height: 10px;
        z-index: 15;
    }
`;

const SubMenuStack = styled(Stack)<{ gap?: '0.125rem' | '0.25rem' | '0.5rem' | '0.75rem' | '1rem' | '1.5rem' | '1.75rem' | '2rem' | '2.5rem' | number }>`
    position: relative;
    z-index: 5;
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: ${({ gap }) => (typeof gap === 'number' ? `${gap}px` : gap)};
    font-size: 16px;
    font-weight: 400;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        gap: 10px;
        font-size: 14px;
    }

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        gap: 5px;
        font-size: 12px;
        flex-wrap: wrap; // Allow wrapping for smaller screens
    }
`;

const StyledLink = styled(Link)<{ isSubMenu?: boolean }>`
    color: ${p => p.theme.text.main} !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${p => (p.isSubMenu ? 400 : 600)};
    font-size: ${p => (p.isSubMenu ? '18px' : '20px')};
    white-space: nowrap;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: ${p => (p.isSubMenu ? '16px' : '18px')};
    }

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        font-size: ${p => (p.isSubMenu ? '14px' : '16px')};
    }
`;
