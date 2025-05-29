import { Stack } from '@/src/components/atoms/Stack';
import { Input, Banner } from '@/src/components/forms';
import { storefrontApiMutation } from '@/src/graphql/client';
import { ActiveCustomerSelector, ActiveCustomerType } from '@/src/graphql/selectors';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import * as z from 'zod';
import { MotionCustomerWrap, Form, StyledButton } from '../atoms/shared';
import { useChannels } from '@/src/state/channels';
import { Select } from '@/src/components';
import { Label } from '@/src/components/forms/shared';

interface Channel {
    sellerId: string;
    seller: {
        name: string;
    };
}

/**
 * 1) Define the form shape:
 *    customFields -> preferredSeller -> { id: string }
 */
interface CustomerDataForm {
    addressEmail: ActiveCustomerType['emailAddress'];
    firstName: ActiveCustomerType['firstName'];
    lastName: ActiveCustomerType['lastName'];
    phoneNumber: ActiveCustomerType['phoneNumber'];
    customFields?: {
        preferredSeller?: {
            id?: string;
        };
    };
}

export const CustomerDetailsForm: React.FC<{
    initialCustomer: ActiveCustomerType;
    channels: Array<Channel>;
}> = ({ initialCustomer, channels }) => {
    const ctx = useChannels();
    const { t } = useTranslation('customer');
    const { t: tErrors } = useTranslation('common');
    const [activeCustomer, setActiveCustomer] = useState<ActiveCustomerType>(initialCustomer);
    const [successBanner, setSuccessBanner] = useState<string>();

    // Build your array of seller options for the <Select>:
    const sellerOptions = channels?.map(({ sellerId, seller }) => ({
        label: seller.name,
        value: String(sellerId),
    }));

    // 2) Zod schema for the nested object
    const customerSchema = z.object({
        addressEmail: z.string().email({ message: tErrors('errors.email.invalid') }),
        firstName: z.string().min(1, { message: tErrors('errors.firstName.required') }),
        lastName: z.string().min(1, { message: tErrors('errors.lastName.required') }),
        phoneNumber: z
            .string()
            .min(1, { message: tErrors('errors.phoneNumber.required') })
            .optional(),
        customFields: z
            .object({
                preferredSeller: z
                    .object({
                        id: z.string().optional(),
                    })
                    .optional(),
            })
            .optional(),
    });

    // 3) Configure useForm and default values
    const {
        control,
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CustomerDataForm>({
        defaultValues: {
            addressEmail: activeCustomer?.emailAddress ?? '',
            firstName: activeCustomer?.firstName ?? '',
            lastName: activeCustomer?.lastName ?? '',
            phoneNumber: activeCustomer?.phoneNumber ?? '',
            customFields: {
                preferredSeller: {
                    id: activeCustomer?.customFields?.preferredSeller?.id ?? '',
                },
            },
        },
        resolver: zodResolver(customerSchema),
    });

    // 4) Submit: read from 'customFields.preferredSeller.id'
    // and pass that to the mutation (no quotes, purely JS object).
    const onCustomerDataChange: SubmitHandler<CustomerDataForm> = async input => {
        const { addressEmail, firstName, lastName, phoneNumber, customFields } = input;
        const sellerId = customFields?.preferredSeller?.id; // string or undefined

        try {
            const { updateCustomer } = await storefrontApiMutation(ctx)({
                updateCustomer: [
                    {
                        input: {
                            emailAddress: addressEmail,
                            firstName,
                            lastName,
                            phoneNumber,
                            customFields: {
                                preferredSellerId: sellerId, // vendure sees: { preferredSeller: { id: "2" } }
                            },
                        },
                    },
                    ActiveCustomerSelector,
                ],
            });

            if (!updateCustomer) {
                setError('root', { message: tErrors('errors.backend.UNKNOWN_ERROR') });
                return;
            }

            setActiveCustomer(prev => ({ ...prev, ...updateCustomer }));
            setSuccessBanner(t('accountPage.detailsForm.successMessage'));
        } catch {
            setError('root', { message: tErrors('errors.backend.UNKNOWN_ERROR') });
        }
    };

    // Hide success banner after 5 seconds
    useEffect(() => {
        if (successBanner) {
            const timer = setTimeout(() => setSuccessBanner(undefined), 5000);
            return () => clearTimeout(timer);
        }
    }, [successBanner]);

    return (
        <>
            <Banner clearErrors={() => setSuccessBanner(undefined)} success={{ message: successBanner }} />
            <MotionCustomerWrap
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                }}>
                <Form onSubmit={handleSubmit(onCustomerDataChange)} noValidate>
                    <Stack gap="2rem" column itemsCenter>
                        <Input {...register('addressEmail')} label={t('accountPage.detailsForm.addressEmail')} />
                        <Stack w100 gap="1.25rem">
                            <Input
                                label={t('accountPage.detailsForm.firstName')}
                                {...register('firstName')}
                                error={errors.firstName}
                            />
                            <Input
                                label={t('accountPage.detailsForm.lastName')}
                                {...register('lastName')}
                                error={errors.lastName}
                            />
                        </Stack>
                        <Input
                            label={t('accountPage.detailsForm.phoneNumber')}
                            {...register('phoneNumber')}
                            error={errors.phoneNumber}
                        />

                        <Stack column w100>
                            <Label>{t('accountPage.detailsForm.customFields.preferredSeller')}</Label>
                            <Controller
                                name="customFields.preferredSeller.id"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select<string> options={sellerOptions} value={value} setValue={onChange} />
                                )}
                            />
                            {errors.customFields?.preferredSeller?.id && (
                                <p style={{ color: 'red' }}>{errors.customFields.preferredSeller.id.message}</p>
                            )}
                        </Stack>
                    </Stack>

                    <StyledButton loading={isSubmitting} type="submit">
                        {t('accountPage.detailsForm.changeDetails')}
                    </StyledButton>
                </Form>
            </MotionCustomerWrap>
        </>
    );
};
