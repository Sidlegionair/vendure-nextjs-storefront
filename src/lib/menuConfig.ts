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

// Default empty productVariants structure
const emptyProductVariants = {
    totalItems: 0,
    items: [] as CollectionTileProductVariantType[],
};

// Language-specific slug mappings
const languageSlugMapping: { [key: string]: { [key: string]: string } } = {
    home: {
        en: '',
    },
    powder: {
        en: 'collections/snowboards/?terrain=powder&page=1',
    },
    allMountain: {
        en: 'collections/snowboards/?page=1&terrain=all+mountain',
    },
    freestyle: {
        en: 'collections/snowboards/?6=143&terrain=freestyle&page=1',
    },
    brands: {
        en: 'content/brands',
        nl: 'content/snowboardmerken/',
    },
};

// Resolve slug based on language and key
const resolveSlug = (key: string, language: string): string => {
    return languageSlugMapping[key]?.[language] || languageSlugMapping[key]?.['en'] || '';
};

// Build main and sub-navigation based on language
const buildNavigation = (locale: string): {
    mainNavigation: NavigationItemType[];
    subNavigation: NavigationItemType[];
} => {
    const mainNavigation: NavigationItemType[] = [
        {
            name: 'Home',
            id: 'none',
            parentId: '',
            slug: resolveSlug('home', locale),
            description: '',
            productVariants: emptyProductVariants,
            children: [],
        },
    ];

    const subNavigation: NavigationItemType[] = [
        {
            name: 'Powder',
            id: 'none',
            parentId: '1',
            slug: resolveSlug('powder', locale),
            description: '',
            productVariants: emptyProductVariants,
            children: [],
        },
        {
            name: 'All mountain',
            id: 'none',
            parentId: '1',
            slug: resolveSlug('allMountain', locale),
            description: '',
            productVariants: emptyProductVariants,
            children: [],
        },
        {
            name: 'Freestyle',
            id: 'none',
            parentId: '1',
            slug: resolveSlug('freestyle', locale),
            description: '',
            productVariants: emptyProductVariants,
            children: [],
        },
        {
            name: 'Brands',
            id: 'none',
            parentId: '1',
            slug: resolveSlug('brands', locale),
            description: '',
            productVariants: emptyProductVariants,
            children: [],
        },
    ];

    return { mainNavigation, subNavigation };
};

// Main function to get the navigation tree
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

    if (Array.isArray(mainNavigation)) {
        navigation.children.unshift(...mainNavigation);
    } else {
        console.error("mainNavigation is not iterable:", mainNavigation);
    }

    const subnavigation = {
        children: Array.isArray(subNavigation) ? subNavigation : [],
    };

    return {
        navigation: navigation as RootNode<NavigationItemType>,
        subnavigation: subnavigation as RootNode<NavigationItemType>,
    };
};
