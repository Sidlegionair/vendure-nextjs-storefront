import { CheckoutLayout, Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginCustomerInputType } from '@/src/graphql/selectors';
import { storefrontApiMutation } from '@/src/graphql/client';
import { Link } from '@/src/components/atoms/Link';
import { Stack } from '@/src/components/atoms/Stack';
import { Input, Banner, CheckBox } from '@/src/components/forms';
import { Button } from '@/src/components/molecules/Button';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { usePush } from '@/src/lib/redirect';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { useCart } from '@/src/state/cart';
import { Absolute, Form, FormContainer, FormContent, FormWrapper } from '../components/shared';
import { getServerSideProps } from './props';
import { useChannels } from '@/src/state/channels';
import styled from '@emotion/styled';

export const SignInPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const ctx = useChannels();
    const { t } = useTranslation('customer');
    const { t: tErrors } = useTranslation('common');
    const { fetchActiveOrder } = useCart();

    const schema = z.object({
        emailAddress: z.string().email(tErrors('errors.email.invalid')).min(1, tErrors('errors.email.required')),
        password: z.string(), //let backend handle this
        // password: z.string().min(8, tErrors('errors.password.minLength')).max(25, tErrors('errors.password.maxLength')),
        rememberMe: z.boolean().optional(),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginCustomerInputType>({
        resolver: zodResolver(schema),
    });
    const push = usePush();
    const onSubmit: SubmitHandler<LoginCustomerInputType> = async data => {
        const { emailAddress, password, rememberMe } = data;
        try {
            const { login } = await storefrontApiMutation(ctx)({
                login: [
                    { password, username: emailAddress, rememberMe },
                    {
                        __typename: true,
                        '...on CurrentUser': { id: true },
                        '...on InvalidCredentialsError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on NativeAuthStrategyError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on NotVerifiedError': {
                            errorCode: true,
                            message: true,
                        },
                    },
                ],
            });

            if (login.__typename === 'CurrentUser') {
                await fetchActiveOrder();
                push('/customer/manage');
                return;
            }

            setError('root', { message: tErrors(`errors.backend.${login.errorCode}`) });
        } catch {
            setError('root', { message: tErrors('errors.backend.UNKNOWN_ERROR') });
        }
    };

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('signInTitle')}>
            <StyledAuthContainer>
                <FormContainer>
                    <StyledFormWrapper column itemsCenter gap="3.5rem">
                        <Absolute w100>
                            <Banner error={errors.root} clearErrors={() => setError('root', { message: undefined })} />
                        </Absolute>
                        <StyledH3>{t('signInTitle')}</StyledH3>
                        <FormContent w100 column itemsCenter gap="1.75rem">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <StyledInput
                                    error={errors.emailAddress}
                                    label={t('email')}
                                    type="text"
                                    {...register('emailAddress')}
                                />
                                <StyledInput
                                    error={errors.password}
                                    label={t('password')}
                                    type="password"
                                    {...register('password')}
                                />
                                <CheckBox label={t('rememberMe')} {...register('rememberMe')} />
                                <StyledButton loading={isSubmitting} type="submit">
                                    {t('signIn')}
                                </StyledButton>
                            </Form>
                            <Stack column itemsCenter gap="0.5rem">
                                <StyledLink href="/customer/forgot-password">{t('forgotPassword')}</StyledLink>
                                <StyledLink href="/customer/sign-up">{t('signUp')}</StyledLink>
                            </Stack>
                        </FormContent>
                    </StyledFormWrapper>
                </FormContainer>
            </StyledAuthContainer>
        </Layout>
    );
};

const StyledLink = styled(Link)`
    font-family: "Suisse BP Int'l antique", sans-serif;
    position: relative;
    color: ${({ theme }) => theme.text.main};
    display: block;
    transition: text-decoration 0.3s ease;
    text-decoration: underline;
    line-height: 24px;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;


const StyledH3 = styled.h3`
    font-family: "Suisse BP Int'l antique", sans-serif;
`;

const StyledFormWrapper = styled(FormWrapper)`
    //background: white;
    opacity: 0.8;
    background: ${({ theme }) => theme.background.main};

`;


const StyledAuthContainer = styled(ContentContainer)`
    z-index: 0;
    @media (max-width: ${({ theme }) => theme.breakpoints['3xl']}) {
        width: 100%;
        padding: 0 4rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints['2xl']}) {
        width: 100%;
        padding: 0 3rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        width: 100%;
        padding: 0 2rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        padding: 0 1.5rem;
    }




    position: relative;
    height: 100%;
    min-height: 100vh;
    width: 100%;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('/images/bg/authbg.jpeg') no-repeat center center;
        background-size: cover;
        opacity: 0.2;
        z-index: -1; /* Set the background behind the content */
    }
`;


const StyledInput = styled(Input)`
    width: 100%;

    label {
        font-weight: bold;
    }
`

const StyledButton = styled(Button)`
    align-self: center;
    padding: 18px 84px;
    width: fit-content;
    background-color: ${({ theme }) => theme.background.accent};
    color: ${({ theme }) => theme.background.main};

    &:hover, &:focus{
        border: 1px solid ${({ theme }) => theme.background.accent};
    }
`
