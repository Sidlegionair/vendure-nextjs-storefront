import { LogoAexol } from '@/src/assets';
import { ContentContainer, Divider } from '@/src/components/atoms';
import { UserMenu } from '@/src/components/molecules/UserMenu';
import { Stack } from '@/src/components/atoms/Stack';
import styled from '@emotion/styled';
import { Link } from '@/src/components/atoms/Link';
import { useCart } from '@/src/state/cart';
import { CartDrawer } from '@/src/layouts/CartDrawer';
import { CollectionTileType, NavigationType } from '@/src/graphql/selectors';
import { RootNode } from '@/src/util/arrayToTree';
import { DesktopNavigation } from '@/src/components/organisms/DesktopNavigation';
import { SearchIcon, Menu } from 'lucide-react';
import { IconButton } from '@/src/components/molecules/Button';
import { CategoryBar } from './CategoryBar';
import { NavigationSearch } from '@/src/components/organisms/NavgationSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigationSearch } from '@/src/components/organisms/NavgationSearch/hooks';
import { useEffect, useRef, useState } from 'react';
import { Picker } from '@/src/components/organisms/Picker';
import { useTranslation } from 'next-i18next';

interface NavigationProps {
    navigation: RootNode<NavigationType> | null;
    categories: CollectionTileType[];
    changeModal?: {
        modal: boolean;
        channel: string;
        locale: string;
        country_name: string;
    };
    subnavigation: RootNode<NavigationType> | null;
}

export const Navigation: React.FC<NavigationProps> = ({ navigation, categories, changeModal, subnavigation }) => {
    const { t } = useTranslation('common');
    const { isLogged, cart } = useCart();
    const navigationSearch = useNavigationSearch();
    const searchRef = useRef<HTMLDivElement>(null);
    const searchMobileRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node) &&
            iconRef.current &&
            !iconRef.current.contains(event.target as Node) &&
            searchMobileRef.current &&
            !searchMobileRef.current.contains(event.target as Node)
        ) {
            navigationSearch.closeSearch();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const announcementsBar = typeof t('announcements-bar', { defaultValue: '' }) === 'string'
        ? (t('announcements-bar', { defaultValue: '' }) as string).split('|')
        : [];

    const entries = [
        { text: announcementsBar[0] || '', href: '/collections/all' },
        { text: announcementsBar[1] || '', href: '/' },
        { text: announcementsBar[2] || '', href: '/' },
        { text: announcementsBar[3] || '', href: '/' },
    ];

    return (
        <>
            <StickyContainer>
                <ContentContainer style={{ gap: '25px' }}>
                    <Stack itemsCenter justifyBetween gap={50} w100>
                        <Stack style={{ width: '100%', maxWidth: '33%' }} gap="1rem" itemsCenter>
                            {/* Desktop: show navigation */}
                            <DesktopWrapper>
                                <DesktopNavigation navigation={navigation} />
                            </DesktopWrapper>

                            {/* Mobile: show logo on left */}
                            <MobileWrapper>
                                <Link ariaLabel="Home" href="/">
                                    <LogoAexol width={165} />
                                </Link>
                            </MobileWrapper>
                        </Stack>
                        <Stack style={{ width: '100%', maxWidth: '33%' }} justifyCenter itemsCenter>
                            {/* Desktop: show bigger logo in center */}
                            <DesktopWrapper>
                                <Link ariaLabel="Home" href="/">
                                    <LogoAexol width={256} />
                                </Link>
                            </DesktopWrapper>
                        </Stack>
                        <Stack style={{ width: '100%', maxWidth: '33%' }} gap="1rem" itemsCenter flexWrap justifyEnd>
                            {/* Right side icons: UserMenu, CartDrawer, Picker */}
                            <UserMenu isLogged={isLogged} />
                            <CartDrawer activeOrder={cart} />
                            <Picker changeModal={changeModal} />

                            {/* Desktop: Search icon */}
                            <DesktopWrapper>
                                <IconButton
                                    aria-label="Search products"
                                    onClick={navigationSearch.toggleSearch}
                                    ref={iconRef}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </DesktopWrapper>

                            {/* Mobile: hamburger menu */}
                            <MobileWrapper>
                                <IconButton
                                    aria-label="Open menu"
                                    onClick={() => setMobileMenuOpen(true)}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <Menu />
                                </IconButton>
                            </MobileWrapper>
                        </Stack>
                    </Stack>
                    <Divider />
                    {/* Desktop: subnavigation */}
                    <DesktopWrapper>
                        <Stack>
                            {subnavigation ? (
                                <DesktopNavigation gap={135} navigation={subnavigation} isSubMenu={true} />
                            ) : (
                                <Stack />
                            )}
                        </Stack>
                    </DesktopWrapper>
                    <SearchStack>
                        <AnimatePresence>
                            <DesktopNavigationContainer
                                style={{ width: '100%' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                ref={searchRef}
                            >
                                <NavigationSearch {...navigationSearch} />
                            </DesktopNavigationContainer>
                        </AnimatePresence>
                    </SearchStack>
                </ContentContainer>

                {/* Mobile: search underneath menubar if open */}
                {navigationSearch.searchOpen && (
                    <MobileNavigationContainer ref={searchMobileRef}>
                        <NavigationSearch {...navigationSearch} />
                    </MobileNavigationContainer>
                )}
            </StickyContainer>

            {categories?.length > 0 ? <CategoryBar collections={categories} /> : null}

            {/* Mobile Slide-Out Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <MobileMenuOverlay
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3 }}
                    >
                        <MobileMenuContent>
                            <MobileMenuHeader>
                                <Link ariaLabel="Home" href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <LogoAexol width={165} />
                                </Link>
                                <IconButton aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
                                    &times;
                                </IconButton>
                            </MobileMenuHeader>

                            {/* Mobile: put all navigation links here */}
                            {navigation && (
                                <MobileMenuNav>
                                    <DesktopNavigation navigation={navigation} />
                                    {subnavigation && (
                                        <DesktopNavigation navigation={subnavigation} isSubMenu={true} />
                                    )}
                                </MobileMenuNav>
                            )}
                        </MobileMenuContent>
                    </MobileMenuOverlay>
                )}
            </AnimatePresence>
        </>
    );
};

const SearchStack = styled(Stack)`
    margin-bottom: -50px;
`;

const StickyContainer = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    padding: 25px;
    position: sticky;
    top: 0;
    background: #FFFFFF;
    z-index: 2137;
    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.06);

    svg {
        max-height: 4rem;
    }
`;

const DesktopNavigationContainer = styled(motion.div)`
    display: none;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const MobileNavigationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 2rem 0 2rem;
    width: 100%;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: none;
    }
`;

const DesktopWrapper = styled.div`
    display: none;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: block;
    }
`;

const MobileWrapper = styled.div`
    display: block;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: none;
    }
`;

const MobileMenuOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: none;
    }
`;

const MobileMenuContent = styled.div`
    background: #ffffff;
    width: 90vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow-y: auto;
`;

const MobileMenuHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;

    a {
        display: inline-flex;
        align-items: center;
    }

    button {
        font-size: 2rem;
        background: none;
        border: none;
        cursor: pointer;
    }
`;

const MobileMenuNav = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${p => p.theme.gray(100)};

    nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        a {
            text-decoration: none;
            color: inherit;
        }
    }
`;
