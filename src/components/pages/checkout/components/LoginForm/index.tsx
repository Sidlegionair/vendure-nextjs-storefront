import React from 'react';
import styled from '@emotion/styled';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';

import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Stack } from '@/src/components/atoms/Stack';
import { Button } from '@/src/components/molecules/Button';
import { Banner, Input } from '@/src/components/forms';
import { storefrontApiMutation } from '@/src/graphql/client';
import { useChannels } from '@/src/state/channels';

type LoginFormValues = {
    emailAddress: string;
    password: string;
};

interface LoginFormProps {
    onLoginSuccess: () => void;
    fetchActiveOrder: () => Promise<any>;
    insideForm?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, fetchActiveOrder, insideForm = false }) => {
    const ctx = useChannels();
    const { t } = useTranslation('checkout');
    const { t: tErrors } = useTranslation('common');

    const schema = z.object({
        emailAddress: z.string().email(tErrors('errors.email.invalid')).min(1, tErrors('errors.email.required')),
        password: z.string().min(1, tErrors('errors.password.required')),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<LoginFormValues> = async data => {
        const { emailAddress, password } = data;
        try {
            console.log('Attempting login with:', { emailAddress });
            const response = await storefrontApiMutation(ctx)({
                login: [
                    { password, username: emailAddress, rememberMe: true },
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

            console.log('Login response:', response);
            const { login } = response;
            console.log('Login object:', login);
            console.log('Login __typename:', login.__typename);

            if (login.__typename === 'CurrentUser') {
                console.log('Login successful, fetching active order');
                try {
                    await fetchActiveOrder();
                    console.log('Active order fetched successfully');
                    console.log('Calling onLoginSuccess');
                    onLoginSuccess();
                    return;
                } catch (fetchError) {
                    console.error('Error fetching active order after login:', fetchError);
                    // Don't show an error to the user, just proceed with login success
                    // The order might be fetched later when the component mounts
                    console.log('Proceeding with login despite fetchActiveOrder error');
                    onLoginSuccess();
                    return;
                }
            }

            console.log('Login failed with errorCode:', login.errorCode);
            setError('root', { message: tErrors(`errors.backend.${login.errorCode}`) });
        } catch (error) {
            console.error('Exception during login:', error);
            setError('root', { message: tErrors('errors.backend.UNKNOWN_ERROR') });
        }
    };

    return (
        <LoginContainer>
            <TH2 size="24px" weight={600}>
                {t('loginForm.title')}
            </TH2>
            <TP size="16px" style={{ marginBottom: '20px' }}>
                {t('loginForm.subtitle')}
            </TP>

            <Banner error={errors.root} clearErrors={() => setError('root', { message: undefined })} />

            {insideForm ? (
                <FormContent>
                    <Stack column gap="15px">
                        <Input
                            error={errors.emailAddress}
                            label={t('loginForm.email')}
                            type="email"
                            {...register('emailAddress')}
                        />
                        <Input
                            error={errors.password}
                            label={t('loginForm.password')}
                            type="password"
                            {...register('password')}
                        />
                        <LoginButton 
                            loading={isSubmitting} 
                            type="button" 
                            onClick={handleSubmit(onSubmit)}
                        >
                            {t('loginForm.signIn')}
                        </LoginButton>
                    </Stack>
                </FormContent>
            ) : (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Stack column gap="15px">
                        <Input
                            error={errors.emailAddress}
                            label={t('loginForm.email')}
                            type="email"
                            {...register('emailAddress')}
                        />
                        <Input
                            error={errors.password}
                            label={t('loginForm.password')}
                            type="password"
                            {...register('password')}
                        />
                        <LoginButton loading={isSubmitting} type="submit">
                            {t('loginForm.signIn')}
                        </LoginButton>
                    </Stack>
                </Form>
            )}
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 8px;
    background-color: ${p => p.theme.background.light};
    border: 1px solid ${p => p.theme.border.main};
`;

const Form = styled.form`
    width: 100%;
`;

const FormContent = styled.div`
    width: 100%;
`;

const LoginButton = styled(Button)`
    margin-top: 10px;
    width: 100%;
    background-color: ${p => p.theme.background.accent};
    color: ${p => p.theme.background.main};

    &:hover {
        border: 1px solid ${p => p.theme.background.accent};
        color: ${p => p.theme.text.accent};
    }
`;
