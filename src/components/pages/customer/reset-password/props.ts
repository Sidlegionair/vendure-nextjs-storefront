import { getCollections } from '@/src/graphql/sharedQueries';
import { getNavigationTree } from '@/src/lib/menuConfig';
import { makeServerSideProps } from '@/src/lib/getStatic';
import { prepareSSRRedirect, redirectFromDefaultChannelSSR } from '@/src/lib/redirect';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const r = await makeServerSideProps(['common', 'customer'])(context);
    const translationRedirect = redirectFromDefaultChannelSSR(context);
    if (translationRedirect) return translationRedirect;

    const collections = await getCollections(r.context);
    const { navigation, subnavigation } = await getNavigationTree(r.context, collections);

    const token = context.query.token as string;
    const homePageRedirect = prepareSSRRedirect('/')(context);

    if (!token) return homePageRedirect;

    const returnedStuff = {
        ...r.props,
        ...r.context,
        collections,
        token,
        navigation,
        subnavigation,
    };

    return { props: returnedStuff };
};
