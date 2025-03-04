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
import { Button, IconButton, MenuOpenButton } from '@/src/components/molecules/Button';
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
                <CustomContentContainer>
                    <MainStack>
                        <LeftStack gap="50px" itemsCenter>
                            {/* Desktop: show navigation */}
                            <DesktopWrapper>
                                <DesktopNavigation gap={100} navigation={navigation} />
                            </DesktopWrapper>

                            {/* Mobile: show logo on left */}
                            <MobileWrapper>
                                <Link skipChannelHandling ariaLabel="Home" href="/">
                                    <LogoAexol width={150} />
                                </Link>
                            </MobileWrapper>
                        </LeftStack>

                        {/* Desktop: show bigger logo in center */}
                        <CenterStack justifyCenter itemsCenter>
                            <DesktopWrapper>
                                <Link ariaLabel="Home" href="/">
                                    <LogoAexol width={256} />
                                </Link>
                            </DesktopWrapper>
                        </CenterStack>

                        <RightStack itemsCenter>
                            {/* Right side icons: UserMenu, CartDrawer, Picker */}
                            <UserMenu isLogged={isLogged} />
                            <CartDrawer activeOrder={cart} />
                            <Picker changeModal={changeModal} />

                            {/*/!* Desktop: Search icon *!/*/}
                            {/*<DesktopWrapper>*/}
                            {/*    <IconButton*/}
                            {/*        aria-label="Search snowboards"*/}
                            {/*        onClick={navigationSearch.toggleSearch}*/}
                            {/*        ref={iconRef}*/}
                            {/*    >*/}
                            {/*        <SearchIcon />*/}
                            {/*    </IconButton>*/}
                            {/*</DesktopWrapper>*/}

                            {/* Mobile: hamburger menu */}
                            <MobileWrapper>
                                <MenuOpenButton
                                    aria-label="Open menu"
                                    onClick={() => setMobileMenuOpen(true)}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <svg width="26" height="18" viewBox="0 0 26 18" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1H25M1 9H25M1 17H25" stroke="black" stroke-width="2"
                                              stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </MenuOpenButton>
                            </MobileWrapper>
                        </RightStack>
                    </MainStack>

                    <DesktopWrapper>
                    <Divider />
                    </DesktopWrapper>

                    {/* Desktop: subnavigation */}
                    <DesktopWrapper>
                        <Stack>
                            {subnavigation ? (
                                <DesktopNavigation gap={5} navigation={subnavigation} isSubMenu={true} />
                            ) : (
                                <Stack />
                            )}
                        </Stack>
                    </DesktopWrapper>

                    <SearchStack>
                        <AnimatePresence>
                            <DesktopNavigationContainer
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
                </CustomContentContainer>

                {/* Mobile: search underneath menubar if open */}
                {navigationSearch.searchOpen && (
                    <MobileNavigationContainer ref={searchMobileRef}>
                        <NavigationSearch {...navigationSearch} />
                    </MobileNavigationContainer>
                )}
            </StickyContainer>

            <DesktopWrapper>
                {/*{categories?.length > 0 ? <CategoryBar collections={categories} /> : null}*/}
            </DesktopWrapper>
            {/* Mobile Slide-Out Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <MobileMenuOverlay
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                    >
                        <MobileMenuContent>
                            <MobileMenuHeader>
                                <Link ariaLabel="Home" href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <LogoAexol width={165} />
                                </Link>
                                <Button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.954027 17L0 16.046L7.54597 8.5L0 0.954027L0.954027 0L8.5 7.54597L16.046 0L17 0.954027L9.45403 8.5L17 16.046L16.046 17L8.5 9.45403L0.954027 17Z"
                                            fill="#9E2E3A" />
                                    </svg>
                                </Button>
                            </MobileMenuHeader>

                            {/* Mobile: put all navigation links here */}
                            {navigation && (
                                <MobileMenuNav>
                                    <DesktopNavigation gap={21} navigation={navigation} />
                                    <Divider />
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

// Styled Components

const SearchStack = styled(Stack)`
    margin-bottom: -50px;
    width: 100%;
`;

const StickyContainer = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;

    padding: 20px 0px 40px 0px;
    position: fixed;

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        padding: 25px;
        position: sticky;

    }

    top: 0;
    background: #FFFFFF;
    z-index: 2137;
    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.06);

    svg {
        //max-height: 4rem;
    }
`;

const CustomContentContainer = styled(ContentContainer)`
    //display: flex;
    //align-items: center;
    //justify-content: center;
    //width: 100%;
    gap: 2rem;
`;


const DesktopNavigationContainer = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
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
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
    z-index: 9999;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: stretch;
    box-shadow: -3px 0px 6px rgba(0, 0, 0, 0.08);

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: none;
    }
`;

const MobileMenuContent = styled.div`
    background: #ffffff;
    //width: 90vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    overflow-y: auto;
`;

const MobileMenuHeader = styled.div`
    display: flex;
    align-items: start;
    justify-content: start;
    padding: 30px 20px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);

    a {
        display: inline-flex;
        align-items: start;
    }

    button {
        font-size: 17px;

        background: none;
        border: none;
        cursor: pointer;
    }
`;

const MobileMenuNav = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

// New Styled Components for Responsive Layout

const MainStack = styled(Stack)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: 25px; /* Default gap for mobile */

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        gap: 15px; /* Increased gap for desktop */
    }
`;

const LeftStack = styled(Stack)`
    //width: auto;
    //max-width: 33%;

    // @media (min-width: ${p => p.theme.breakpoints.md}) {
        width: 100%;
    //}
`;

const CenterStack = styled(Stack)`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RightStack = styled(Stack)`
    width: auto;
    gap: 5px;

    flex-wrap: nowrap;
    justify-content: flex-end;

    @media (min-width: ${p => p.theme.breakpoints.md}) {
        width: 100%;
        gap: 20px;

    }
`;
