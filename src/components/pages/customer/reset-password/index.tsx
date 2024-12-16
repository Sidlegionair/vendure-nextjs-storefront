import { Layout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React from 'react';
import { ContentContainer } from '@/src/components/atoms/ContentContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { storefrontApiMutation } from '@/src/graphql/client';
import { Input, Banner } from '@/src/components/forms';
import { Button } from '@/src/components/molecules/Button';
import { usePush } from '@/src/lib/redirect';
import { Absolute, Form, FormContainer, FormContent, FormWrapper } from '../components/shared';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { getServerSideProps } from './props';
import { useChannels } from '@/src/state/channels';
import styled from '@emotion/styled';

type FormValues = { password: string; confirmPassword: string };

export const ResetPasswordPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const ctx = useChannels();
    const { t } = useTranslation('customer');
    const { t: tErrors } = useTranslation('common');

    const schema = z
        .object({
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
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });
    const push = usePush();

    const onSubmit: SubmitHandler<FormValues> = async data => {
        try {
            const { resetPassword } = await storefrontApiMutation(ctx)({
                resetPassword: [
                    { password: data.password, token: props.token as string },
                    {
                        __typename: true,
                        '...on CurrentUser': { id: true },
                        '...on NativeAuthStrategyError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on NotVerifiedError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on PasswordResetTokenExpiredError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on PasswordResetTokenInvalidError': {
                            errorCode: true,
                            message: true,
                        },
                        '...on PasswordValidationError': {
                            errorCode: true,
                            message: true,
                            validationErrorMessage: true,
                        },
                    },
                ],
            });

            if (resetPassword.__typename === 'CurrentUser') {
                push('/customer/sign-in');
                return;
            }

            setError('root', { message: tErrors(`errors.backend.${resetPassword.errorCode}`) });
        } catch {
            setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
        }
    };

    return (
        <Layout categories={props.collections} navigation={props.navigation} subnavigation={props.subnavigation} pageTitle={t('resetPasswordTitle')}>
            <StyledAuthContainer>
                <FormContainer>
                    <Absolute w100>
                        <Banner error={errors.root} clearErrors={() => setError('root', { message: undefined })} />
                    </Absolute>
                    <StyledTP weight={600}>{t('resetPasswordTitle')}</StyledTP>
                    <StyledFormWrapper column itemsCenter gap="1.75rem">
                        <FormContent w100 column itemsCenter gap="1.75rem">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <StyledInput
                                    error={errors.password}
                                    label={t('newPassword')}
                                    type="password"
                                    {...register('password')}
                                />
                                <StyledInput
                                    error={errors.confirmPassword}
                                    label={t('confirmNewPassword')}
                                    type="password"
                                    {...register('confirmPassword')}
                                />
                                <StyledButton loading={isSubmitting} type="submit">
                                    {t('resetPassword')}
                                </StyledButton>
                            </Form>
                        </FormContent>
                    </StyledFormWrapper>
                </FormContainer>
            </StyledAuthContainer>
        </Layout>
    );
};



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


const StyledInput = styled(Input)`
    width: 100%;
    
    label {
        font-size: 16px;
        line-height: 16px;
        font-weight: 300;
    }
`

const StyledButton = styled(Button)`
    background-color: ${({ theme }) => theme.background.accent};
    color: ${({ theme }) => theme.background.main};
`
