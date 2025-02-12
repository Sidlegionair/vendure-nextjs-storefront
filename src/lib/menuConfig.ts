import { GetServerSidePropsContext } from 'next';
import { CollectionTileProductVariantType } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { arrayToTree } from '@/src/util/arrayToTree';

type NavigationItemType = {
    name: string;
    id: string;
    parentId: string;
    slug: string;
    description: string;
    productVariants: {
        totalItems: number;
        items: CollectionTileProductVariantType[];
    };
    children: NavigationItemType[];
};

type RootNode<T> = {
    children: T[];
};

const emptyProductVariants = {
    totalItems: 0,
    items: [] as CollectionTileProductVariantType[],
};

type NavItemConfig = {
    title: { [locale: string]: string };
    slug: { [locale: string]: string };
};

const navItemsConfig: { [key: string]: NavItemConfig } = {
    home: {
        title: { en: 'Home', nl: 'Home' },
        slug: { en: '', nl: '' },
    },
    powder: {
        title: { en: 'Powder', nl: 'Powder' },
        slug: { en: 'collections/snowboards/?terrain=powder&page=1', nl: 'collections/snowboards/?terrain=powder&page=1' },
    },
    allMountain: {
        title: { en: 'All mountain', nl: 'All mountain' },
        slug: { en: 'collections/snowboards/?page=1&terrain=all+mountain', nl: 'collections/snowboards/?page=1&terrain=all+mountain' },
    },
    freestyle: {
        title: { en: 'Freestyle', nl: 'Freestyle' },
        slug: { en: 'collections/snowboards/?6=143&terrain=freestyle&page=1', nl: 'collections/snowboards/?6=143&terrain=freestyle&page=1' },
    },
    brands: {
        title: { en: 'Brands', nl: 'Merken' },
        slug: { en: 'content/brands', nl: 'content/snowboardmerken/' },
    },
    stores: {
        title: { en: 'Stores', nl: 'Winkels' },
        slug: { en: 'content/boardshops', nl: 'content/boardshops/' },
    },

};

// Helper that returns a single string value based on the current locale
const resolveTranslatable = (value: { [locale: string]: string }, locale: string): string => {
    return value[locale] || value['en'] || '';
};

const createNavItem = (
    key: string,
    locale: string,
    id: string,
    parentId: string = ''
): NavigationItemType => {
    const config = navItemsConfig[key];
    return {
        name: resolveTranslatable(config.title, locale),
        id,
        parentId,
        slug: resolveTranslatable(config.slug, locale),
        description: '',
        productVariants: emptyProductVariants,
        children: [],
    };
};

const buildNavigation = (locale: string): {
    mainNavigation: NavigationItemType[];
    subNavigation: NavigationItemType[];
} => {
    const mainNavigation: NavigationItemType[] = [createNavItem('home', locale, 'none')];

    const subNavigation: NavigationItemType[] = [
        createNavItem('powder', locale, 'none', '1'),
        createNavItem('allMountain', locale, 'none', '1'),
        createNavItem('freestyle', locale, 'none', '1'),
        createNavItem('brands', locale, 'none', '1'),
        createNavItem('stores', locale, 'none', '1'),
    ];

    return { mainNavigation, subNavigation };
};

export const getNavigationTree = async (
    params: { locale: string; channel: string },
    collections?: any[]
): Promise<{ navigation: RootNode<NavigationItemType>; subnavigation: RootNode<NavigationItemType> }> => {
    const { locale = 'en', channel } = params;

    // Use provided collections or fetch them dynamically
    const fetchedCollections = collections || (await getCollections({ locale, channel }));

    // Convert collections to a tree structure
    const navigation = arrayToTree(fetchedCollections) || { children: [] };

    if (!Array.isArray(navigation.children)) {
        console.error("Navigation.children is not an array:", navigation);
        return { navigation: { children: [] }, subnavigation: { children: [] } };
    }

    // Build main and sub-navigation based on the detected locale
    const { mainNavigation, subNavigation } = buildNavigation(locale);

    navigation.children.unshift(...mainNavigation);

    const subnavigation = {
        children: Array.isArray(subNavigation) ? subNavigation : [],
    };

    return {
        navigation: navigation as RootNode<NavigationItemType>,
        subnavigation: subnavigation as RootNode<NavigationItemType>,
    };
};
