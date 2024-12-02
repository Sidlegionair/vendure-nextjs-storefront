import { SSRQuery } from '@/src/graphql/client';
import { OrderSelector } from '@/src/graphql/selectors';
import { getCollections } from '@/src/graphql/sharedQueries';
import { mainNavigation, subNavigation } from '@/src/lib/menuConfig';

import { makeServerSideProps } from '@/src/lib/getStatic';
import { prepareSSRRedirect, redirectFromDefaultChannelSSR } from '@/src/lib/redirect';
import { arrayToTree } from '@/src/util/arrayToTree';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const r = await makeServerSideProps(['common', 'checkout'])(context);
    const translationRedirect = redirectFromDefaultChannelSSR(context);
    if (translationRedirect) return translationRedirect;
    const homePageRedirect = prepareSSRRedirect('/')(context);
    const api = SSRQuery(context);

    const collections = await getCollections(r.context);
    const navigation = arrayToTree(collections);

    // Append main and sub-navigation from menuConfig
    navigation.children.unshift(...mainNavigation);
    const subnavigation = {
        children: [...subNavigation],
    };
    const code = context.params?.code as string;
    if (!code) return homePageRedirect;

    try {
        const { orderByCode } = await api({
            orderByCode: [{ code }, OrderSelector],
        });

        if (!orderByCode || orderByCode.active) throw new Error(`Order not ready yet ${code}`);

        const returnedStuff = {
            ...r.props,
            ...r.context,
            collections,
            code,
            orderByCode,
            navigation,
            subnavigation,

        };

        return { props: returnedStuff };
    } catch (e) {
        return { props: { ...r.props, subnavigation, ...r.context, collections, code, navigation, orderByCode: null } };
    }
};
