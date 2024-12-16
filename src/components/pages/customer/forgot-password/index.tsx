import { Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React, { useState } from 'react';
import { Stack } from '@/src/components/atoms/Stack';
import { Link } from '@/src/components/atoms/Link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Banner } from '@/src/components/forms';
import { Button } from '@/src/components/molecules/Button';
import { useTranslation } from 'next-i18next';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { storefrontApiMutation } from '@/src/graphql/client';
import { Absolute, Form, FormContainer, FormContent, FormWrapper } from '../components/shared';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { getServerSideProps } from './props';
import { useChannels } from '@/src/state/channels';
import styled from '@emotion/styled';
import theme from 'tailwindcss/defaultTheme';

type FormValues = {
    emailAddress: string;
};

export const ForgotPasswordPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const ctx = useChannels();
    const { t } = useTranslation('customer');
    const { t: tErrors } = useTranslation('common');
    const [success, setSuccess] = useState<string>();

    const schema = z.object({
        emailAddress: z.string().email(tErrors('errors.email.invalid')).min(1, tErrors('errors.email.required')),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<{ emailAddress: string }> = async data => {
        const { emailAddress } = data;
        try {
            const { requestPasswordReset } = await storefrontApiMutation(ctx)({
                requestPasswordReset: [
                    { emailAddress },
                    {
                        __typename: true,
                        '...on Success': {
                            success: true,
                        },
                        '...on NativeAuthStrategyError': {
                            errorCode: true,
                            message: true,
                        },
                    },
                ],
            });

            if (!requestPasswordReset) {
                setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });

                return;
            }

            if (requestPasswordReset?.__typename === 'Success') {
                setSuccess(t('forgotPasswordSuccess'));
                return;
            }

            setError('root', { message: tErrors(`errors.backend.${requestPasswordReset.errorCode}`) });
        } catch {
            setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
        }
    };

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('forgotPasswordTitle')}>
            <StyledAuthContainer>
                <FormContainer>
                    <StyledFormWrapper column itemsCenter gap="3.5rem">
                        <Absolute w100>
                            <Banner
                                error={errors.root}
                                success={success ? { message: success } : undefined}
                                clearErrors={() => {
                                    setError('root', { message: undefined });
                                    setSuccess(undefined);
                                }}
                            />
                        </Absolute>
                        <StyledTP weight={600}>{t('forgotPasswordTitle')}</StyledTP>
                        <FormContent w100 column itemsCenter gap="1.75rem">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <StyledInput
                                    error={errors.emailAddress}
                                    label={t('email')}
                                    type="text"
                                    {...register('emailAddress')}
                                />
                                <StyledButton disabled={isSubmitting} type="submit">
                                    {t('newPassword')}
                                </StyledButton>
                            </Form>
                            <Stack column itemsCenter gap="0.5rem">
                                <StyledLink href="/customer/sign-in">{t('signIn')}</StyledLink>
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
    position: relative;
    color: ${({ theme }) => theme.text.main};
    display: block;
    transition: text-decoration 0.3s ease;

    &:hover {
        text-decoration: underline;
    }
`;


const StyledTP = styled(TP)`
    font-size: 38px;
    line-height: 38px;
`

const StyledFormWrapper = styled(FormWrapper)`
    //background: white;
`


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

const StyledButton = styled(Button)`
    background-color: ${({ theme }) => theme.background.accent};
    color: ${({ theme }) => theme.background.main};
`

const StyledInput = styled(Input)`
    width: 100%;
    
    label {
        font-size: 16px;
        line-height: 16px;
        font-weight: 300;
    }
`