import { SSRMutation } from '@/src/graphql/client';
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

    try {
        const { verifyCustomerAccount } = await (
            await SSRMutation(context)
        )({
            verifyCustomerAccount: [
                { token },
                {
                    __typename: true,
                    '...on CurrentUser': { id: true },
                    '...on MissingPasswordError': {
                        message: true,
                        errorCode: true,
                    },
                    '...on NativeAuthStrategyError': {
                        errorCode: true,
                        message: true,
                    },
                    '...on PasswordAlreadySetError': {
                        message: true,
                        errorCode: true,
                    },
                    '...on VerificationTokenInvalidError': {
                        message: true,
                        errorCode: true,
                    },
                    '...on PasswordValidationError': {
                        errorCode: true,
                        message: true,
                        validationErrorMessage: true,
                    },
                    '...on VerificationTokenExpiredError': {
                        message: true,
                        errorCode: true,
                    },
                },
            ],
        });

        return {
            props: {
                ...r.props,
                ...r.context,
                collections,
                status: { verifyCustomerAccount },
                navigation,
                subnavigation,
            },
        };
    } catch (e) {
        return homePageRedirect;
    }
};
