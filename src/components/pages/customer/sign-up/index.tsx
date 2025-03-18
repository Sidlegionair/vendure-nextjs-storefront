import { Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RegisterCustomerInputType } from '@/src/graphql/selectors';
import { storefrontApiMutation } from '@/src/graphql/client';
import { Link } from '@/src/components/atoms/Link';
import { Stack } from '@/src/components/atoms/Stack';
import { Input, Banner } from '@/src/components/forms';
import { Button } from '@/src/components/molecules/Button';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { useTranslation } from 'next-i18next';
import { Absolute, Form, FormContainer, FormContent, FormWrapper } from '../components/shared';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { usePush } from '@/src/lib/redirect';
import { getServerSideProps } from './props';
import { useChannels } from '@/src/state/channels';
import styled from '@emotion/styled';

type FormValues = RegisterCustomerInputType & { confirmPassword: string };

export const SignUpPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const ctx = useChannels();
    const { t } = useTranslation('customer');
    const { t: tErrors } = useTranslation('common');
    const [success, setSuccess] = useState<boolean>(false);
    const push = usePush();
    const schema = z
        .object({
            emailAddress: z.string().email(tErrors('errors.email.invalid')).min(1, tErrors('errors.email.required')),
            password: z
                .string()
                .min(8, tErrors('errors.password.minLength'))
                .max(25, tErrors('errors.password.maxLength')),
            confirmPassword: z
                .string()
                .min(8, tErrors('errors.password.minLength'))
                .max(25, tErrors('errors.password.maxLength')),
        })
        .refine(data => data.password === data.confirmPassword, {
            message: tErrors('errors.confirmPassword.mustMatch'),
            path: ['confirmPassword'],
        });

    const {
        formState: { errors, isSubmitting },
        register,
        handleSubmit,
        setError,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = async data => {
        const { emailAddress, password } = data;

        try {
            const { registerCustomerAccount } = await storefrontApiMutation(ctx)({
                registerCustomerAccount: [
                    { input: { emailAddress, password } },
                    {
                        __typename: true,
                        '...on Success': { success: true },
                        '...on MissingPasswordError': {
                            message: true,
                            errorCode: true,
                        },
                        '...on NativeAuthStrategyError': {
                            message: true,
                            errorCode: true,
                        },
                        '...on PasswordValidationError': {
                            errorCode: true,
                            message: true,
                            validationErrorMessage: true,
                        },
                    },
                ],
            });

            if (registerCustomerAccount.__typename === 'Success') {
                setSuccess(true);
                await new Promise(resolve => setTimeout(resolve, 3000));
                push('/customer/sign-in');
                return;
            }

            setError('root', { message: tErrors(`errors.backend.${registerCustomerAccount.errorCode}`) });
        } catch {
            setError('root', { message: tErrors('errors.backend.UNKNOWN_ERROR') });
        }
    };

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('signUpTitle')}>
            <StyledAuthContainer>
                <FormContainer>
                    <StyledFormWrapper column itemsCenter gap="3.5rem">
                        {success && (
                            <Absolute w100>
                                <Banner success={{ message: t('signUpSuccess') }} />
                            </Absolute>
                        )}
                        <Absolute w100>
                            <Banner error={errors.root} clearErrors={() => setError('root', { message: undefined })} />
                        </Absolute>
                        <StyledH3>{t('signUpTitle')}</StyledH3>
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
                                <StyledInput
                                    error={errors.confirmPassword}
                                    label={t('confirmPassword')}
                                    type="password"
                                    {...register('confirmPassword')}
                                />
                                <StyledButton loading={isSubmitting} type="submit">
                                    {t('signUp')}
                                </StyledButton>
                            </Form>

                            <Stack column itemsCenter gap="0.5rem">
                                <StyledLink href="/customer/forgot-password">{t('forgotPassword')}</StyledLink>
                                <StyledLink href="/customer/sign-in">{t('signIn')}</StyledLink>
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
    min-height: 150%;
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
        color: ${({ theme }) => theme.text.accent};

        border: 1px solid ${({ theme }) => theme.background.accent};
    }
`
