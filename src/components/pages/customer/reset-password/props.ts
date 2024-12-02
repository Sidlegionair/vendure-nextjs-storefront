import { getCollections } from '@/src/graphql/sharedQueries';
import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';

import { makeServerSideProps } from '@/src/lib/getStatic';
import { prepareSSRRedirect, redirectFromDefaultChannelSSR } from '@/src/lib/redirect';
import { arrayToTree } from '@/src/util/arrayToTree';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const r = await makeServerSideProps(['common', 'customer'])(context);
    const translationRedirect = redirectFromDefaultChannelSSR(context);
    if (translationRedirect) return translationRedirect;

    const collections = await getCollections(r.context);
    const navigation = arrayToTree(collections);

    // Append main and sub-navigation from menuConfig
    navigation.children.unshift(...mainNavigation);
    const subnavigation = {
        children: [...subNavigation],
    };
    const token = context.query.token as string;
    const homePageRedirect = prepareSSRRedirect('/')(context);

    if (!token) return homePageRedirect;

    const returnedStuff = {
        ...r.props,
        ...r.context,
        collections,
        token,
        navigation,
        subnavigation
    };

    return { props: returnedStuff };
};
