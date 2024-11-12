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
import { SearchIcon } from 'lucide-react';
import { IconButton } from '@/src/components/molecules/Button';
import { AnnouncementBar } from '@/src/components/organisms/AnnouncementBar';
import { CategoryBar } from './CategoryBar';
import { NavigationSearch } from '@/src/components/organisms/NavgationSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigationSearch } from '@/src/components/organisms/NavgationSearch/hooks';
import { useEffect, useRef } from 'react';
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

    // This should come from a plugin or CMS
    const entries = [
        { text: t('announcements-bar')[0], href: '/collections/all' },
        { text: t('announcements-bar')[1], href: '/' },
        { text: t('announcements-bar')[2], href: '/' },
        { text: t('announcements-bar')[3], href: '/' },
    ];

    return (
        <>
            <StickyContainer>
                <ContentContainer style={{ gap: '25px' }}>
                    <Stack itemsCenter justifyBetween gap="50px" w100>
                        <Stack style={{ width: '100%', maxWidth: '33%' }} gap="1rem" itemsCenter>
                            <DesktopNavigation navigation={navigation} />

                        </Stack>
                        <Stack style={{ width: '100%', maxWidth: '33%' }} justifyCenter itemsCenter>
                            <Link ariaLabel="Home" href="/">
                                <LogoAexol width={256} />
                            </Link>
                        </Stack>
                        <Stack style={{ width: '100%', maxWidth: '33%' }} gap="1rem" itemsCenter flexWrap justifyEnd>
                            {/*<IconButton*/}
                            {/*    aria-label="Search products"*/}
                            {/*    onClick={navigationSearch.toggleSearch}*/}
                            {/*    ref={iconRef}*/}
                            {/*>*/}
                            {/*    <SearchIcon />*/}
                            {/*</IconButton>*/}
                            <UserMenu isLogged={isLogged} />
                            <CartDrawer activeOrder={cart} />
                            <Picker changeModal={changeModal} />
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack>
                        {subnavigation ? (
                            <DesktopNavigation gap={135} navigation={subnavigation} isSubMenu={true} />
                        ) : (
                            <Stack />
                        )}
                    </Stack>
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

                            {/*{navigationSearch.searchOpen ? (*/}
                            {/*) : (*/}
                            {/*    <DesktopNavigation navigation={navigation} />*/}
                            {/*)}*/}
                        </AnimatePresence>
                    </SearchStack>
                </ContentContainer>
                {navigationSearch.searchOpen && (
                    <MobileNavigationContainer ref={searchMobileRef}>
                        <NavigationSearch {...navigationSearch} />
                    </MobileNavigationContainer>
                )}
            </StickyContainer>

            {categories?.length > 0 ? <CategoryBar collections={categories} /> : null}
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
    background: #FFFFFF;    z-index: 2137;
        // border-bottom: 1px solid ${p => p.theme.gray(100)};
    svg {
        max-height: 4rem;
    }

    box-shadow: 0px 6px 4px rgba(0, 0, 0, 0.06);
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

const DesktopNavigationContainer = styled(motion.div)`
    display: none;
    @media (min-width: ${p => p.theme.breakpoints.md}) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
