import styled from '@emotion/styled';
import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Link, ContentContainer } from '@/src/components/atoms';
import { RootNode } from '@/src/util/arrayToTree';
import { NavigationType } from '@/src/graphql/selectors';
import { NavigationLinks } from './NavigationLinks';
import { ProductsSellout } from './ProductsSellout';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/src/state/cart';

interface NavProps {
    navigation: RootNode<NavigationType> | null;
    gap?: number;
    isSubMenu?: boolean;
}

export const DesktopNavigation: React.FC<NavProps> = ({ navigation, gap = 50, isSubMenu = false }) => {
    const { t } = useTranslation('common');
    const { addToCart } = useCart();
    const router = useRouter();

    const StackComponent = isSubMenu ? SubMenuStack : DesktopStack;

    const gapMapping: Record<number, '0rem' | '0.125rem' | '0.25rem' | '0.5rem' | '0.75rem' | '1rem' | '1.25rem' | '1.5rem' | '1.75rem' | '2rem' | '2.5rem' | '3rem' | '3.125rem' | '3.5rem'| '3.75rem' | '4rem' | '5rem' | undefined> = {
        10: '0.125rem',
        20: '0.25rem',
        30: '0.5rem',
        40: '0.75rem',
        50: '3.125rem',
        60: '3.75rem',
        70: '1.75rem',
        80: '2rem',
        90: '2.5rem',
        100: '5rem',
    };

    const gapValue = gapMapping[gap] || undefined;

    const isActiveLink = (href: string): boolean => {
        const currentPath = router.asPath.split(/[?#]/)[0]; // Remove query params and fragments
        const normalizedHref = href.replace(/\/$/, ''); // Remove trailing slash
        const normalizedPath = currentPath.replace(/\/$/, ''); // Remove trailing slash

        // Remove locale prefixes from the path (e.g., /nl/en or /en)
        const removeLocalePrefix = (path: string): string => {
            return path.replace(/^\/(nl|en|de|fr|es)(\/(nl|en|de|fr|es))?/, '');
        };

        const cleanPath = removeLocalePrefix(normalizedPath) || '/';
        const cleanHref = removeLocalePrefix(normalizedHref) || '/';

        // Exact match for Home
        if (cleanHref === '/' && cleanPath === '/') {
            return true;
        }

        // Partial match for other paths
        return cleanHref !== '/' && cleanPath.startsWith(cleanHref);
    };


    return (
        <StackComponent itemsCenter gap={gapValue}>
            {navigation?.children.map((collection) => {
                const href =
                    collection.id === 'none'
                        ? `/${collection.slug}`
                        : collection.parent?.slug !== '__root_collection__'
                            ? `/collections/${collection.parent?.slug}/${collection.slug}`
                            : `/collections/${collection.slug}`;

                const isActive = isActiveLink(href);

                console.log(href);


                if (!collection.children || collection.children.length === 0) {
                    return (
                        <RelativeStack w100 key={collection.name}>
                            <StyledLink href={href} skipChannelHandling isSubMenu={isSubMenu} isActive={isActive}>
                                {collection.name}
                            </StyledLink>
                        </RelativeStack>
                    );
                }

                return (
                    <RelativeStack w100 key={collection.name}>
                        <StyledLink href={href} skipChannelHandling isSubMenu={isSubMenu} isActive={isActive}>
                            {collection.name}
                        </StyledLink>
                        {/*<AbsoluteStack w100>*/}
                        {/*    <ContentContainer>*/}
                        {/*        <Background w100 justifyBetween>*/}
                        {/*            <NavigationLinks collection={collection} />*/}
                        {/*            <ProductSelloutWrapper gap="1.5rem">*/}
                        {/*                <ProductsSellout*/}
                        {/*                    title={t('featured-products')}*/}
                        {/*                    addToCart={addToCart}*/}
                        {/*                    addToCartLabel={t('add-to-cart')}*/}
                        {/*                    collection={collection}*/}
                        {/*                />*/}
                        {/*            </ProductSelloutWrapper>*/}
                        {/*        </Background>*/}
                        {/*    </ContentContainer>*/}
                        {/*</AbsoluteStack>*/}
                    </RelativeStack>
                );
            })}
        </StackComponent>
    );
};

const StyledLink = styled(Link)<{ isSubMenu?: boolean; isActive?: boolean }>`
    font-family: "Suisse BP Int'l antique", sans-serif;

    color: ${p => (p.isActive ? p.theme.text.accent : p.theme.text.main)} !important;
    text-decoration: ${p => (p.isActive ? 'underline' : 'none')};
    text-underline-offset: 4px;

    &:hover {
        color: ${p => p.theme.text.accent};
        text-decoration: underline;
    }

    display: flex;
    align-items: start;
    font-weight: ${p => (p.isSubMenu ? 400 : 'bold')};
    line-height: ${p => (p.isSubMenu ? '26px' : '26px')};

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        font-size: ${({ theme }) => theme.typography.fontSize.h6};
    }

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        font-size: 14px;
    }
`;

const DesktopStack = styled(Stack)`
    @media (max-width: ${p => p.theme.breakpoints.md}) {
        display: flex;
        flex-direction: column;
        font-size: 20px;
        font-weight: 600;
        gap: 10px;
        padding: 30px;
        justify-content: start;
        align-items: start;
    }
    z-index: 9999;
`;

const SubMenuStack = styled(Stack)`
    position: relative;
    z-index: 5;
    width: fit-content;
    display: flex;
    gap: ${({ gap }) => gap || '100px'};

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        flex-wrap: wrap;
        padding: 30px;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        gap: 10px;
        font-size: 14px;
    }
`;

const RelativeStack = styled(Stack)`
    position: relative;
    z-index: 10;
    width: fit-content;

    &:hover > a {
        color: ${p => p.theme.text.main};
        text-decoration: underline;
        text-underline-offset: 0.5rem;
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
    overflow: visible;

    @media (max-width: ${p => p.theme.breakpoints.sm}) {
        left: 0;
        transform: translateX(0);
    }
`;

const ProductSelloutWrapper = styled(Stack)`
    max-width: 50%;
    overflow: hidden;
`;

const Background = styled(Stack)`
    background: ${p => p.theme.background.main};
    box-shadow: 0px 0px 12px ${p => p.theme.shadow};
    border: 1px solid ${p => p.theme.gray(100)};
    margin-top: 4rem;
    padding: 40px;

    @media (max-width: ${p => p.theme.breakpoints.md}) {
        margin-top: 2rem;
        padding: 20px;
    }
`;
