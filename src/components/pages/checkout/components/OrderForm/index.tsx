import React from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'next-i18next';
import { MoveLeft } from 'lucide-react';

import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Stack } from '@/src/components/atoms/Stack';
import { Link } from '@/src/components/atoms/Link';
import { Button } from '@/src/components/molecules/Button';
import { StepsBar } from '@/src/components/molecules/StepsBar';
import { Banner, CheckBox, CountrySelect, FormError, Input } from '@/src/components/forms';
import { DeliveryMethod } from '../DeliveryMethod';
import { OrderSummary } from '../OrderSummary';
import { LoginForm } from '../LoginForm';

import { usePush } from '@/src/lib/redirect';
import { storefrontApiMutation, storefrontApiQuery } from '@/src/graphql/client';
import {
    ActiveCustomerType,
    ActiveOrderSelector,
    AvailableCountriesType,
    CreateAddressType,
    CreateCustomerType,
    ShippingMethodType,
} from '@/src/graphql/selectors';

import { useCheckout } from '@/src/state/checkout';
import { useChannels } from '@/src/state/channels';
import { useCart } from '@/src/state/cart';
import { baseCountryFromLanguage } from '@/src/util/baseCountryFromLanguage';
import { useValidationSchema } from './useValidationSchema';

type FormValues = CreateCustomerType & {
    deliveryMethod?: string;
    shippingDifferentThanBilling?: boolean;
    shipping: CreateAddressType;
    billing: CreateAddressType;
    createAccount?: boolean;
    password?: string;
    confirmPassword?: string;
    terms?: boolean;
};

// Define a type for payment methods
interface PaymentMethod {
    code: string;
    name?: string;
    [key: string]: unknown;
}

interface OrderFormProps {
    availableCountries?: AvailableCountriesType[];
    activeCustomer: ActiveCustomerType | null;
    shippingMethods: ShippingMethodType[] | null;
    eligiblePaymentMethods?: PaymentMethod[] | null;
}

const isAddressesEqual = (a: object, b?: object) => {
    try {
        return JSON.stringify(a) === JSON.stringify(b ?? {});
    } catch (e) {
        return false;
    }
};

// -----------------------------------------------------------------
// VAT-check function using the proxy endpoint and NEXT_PUBLIC_HOST
// -----------------------------------------------------------------
const checkVAT = async (vatNumber: string, countryCode: string): Promise<{ valid: boolean; name: string }> => {
    try {
        const vatWithoutPrefix = vatNumber.startsWith(countryCode) ? vatNumber.slice(countryCode.length) : vatNumber;
        const host = process.env.NEXT_PUBLIC_HOST; // Vendure server host
        const url = `${host}/vies-proxy?countryCode=${countryCode}&vatNumber=${vatWithoutPrefix}`;
        console.log('Checking VAT via proxy at URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
            console.error('VIES proxy response not OK', response.status);
            return { valid: false, name: '' };
        }
        const data = await response.json();
        console.log('VIES proxy response data:', data);
        return { valid: data.isValid, name: data.name };
    } catch (error) {
        console.error('VIES check failed:', error);
        return { valid: false, name: '' };
    }
};

export const OrderForm: React.FC<OrderFormProps> = ({
    availableCountries,
    activeCustomer,
    shippingMethods,
    eligiblePaymentMethods,
}) => {
    const ctx = useChannels();
    const { activeOrder, changeShippingMethod } = useCheckout();
    const { fetchActiveOrder } = useCart();
    const [showLoginForm, setShowLoginForm] = React.useState(!activeCustomer?.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [emailExists, setEmailExists] = React.useState(false);

    const { t } = useTranslation('checkout');
    const { t: tErrors } = useTranslation('common');
    const push = usePush();
    const schema = useValidationSchema();

    const errorRef = React.useRef<HTMLDivElement>(null);

    const defaultShippingAddress = activeCustomer?.addresses?.find(address => address.defaultShippingAddress);
    const defaultBillingAddress = activeCustomer?.addresses?.find(address => address.defaultBillingAddress);

    // Decide on default country code
    const countryCode =
        defaultBillingAddress?.country.code ??
        defaultShippingAddress?.country.code ??
        availableCountries?.find(country => country.name === 'Poland')?.code ??
        baseCountryFromLanguage(ctx.locale);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        watch,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        delayError: 100,
        defaultValues: {
            shippingDifferentThanBilling: defaultShippingAddress
                ? !isAddressesEqual(defaultShippingAddress, defaultBillingAddress)
                : false,
            billing: { countryCode },
        },
        values: activeCustomer
            ? {
                  createAccount: false,
                  emailAddress: activeCustomer.emailAddress,
                  firstName: activeCustomer.firstName,
                  lastName: activeCustomer.lastName,
                  phoneNumber: activeCustomer.phoneNumber,
                  shippingDifferentThanBilling: defaultShippingAddress
                      ? !isAddressesEqual(defaultShippingAddress, defaultBillingAddress)
                      : false,
                  shipping: {
                      ...defaultShippingAddress,
                      streetLine1: defaultShippingAddress?.streetLine1 ?? '',
                      countryCode,
                  },
                  billing: {
                      ...defaultBillingAddress,
                      streetLine1: defaultBillingAddress?.streetLine1 ?? '',
                      countryCode,
                  },
              }
            : undefined,
        resolver: zodResolver(schema),
    });

    React.useEffect(() => {
        setValue('createAccount', false);
    }, [setValue]);

    React.useEffect(() => {
        console.log('Form Errors:', errors);
    }, [errors]);

    const vatRegister = register('billing.customFields.vatNumber', {
        onChange: e => {
            setValue('billing.customFields.vatNumber', e.target.value, {
                shouldValidate: true,
            });
        },
    });

    const enforceCreateAccount = !activeCustomer?.id;

    // -------------------------------
    // Submit Handler
    // -------------------------------
    const onSubmit: SubmitHandler<FormValues> = async ({
        emailAddress,
        firstName,
        lastName,
        deliveryMethod,
        billing,
        shipping,
        phoneNumber,
        shippingDifferentThanBilling,
        password,
    }) => {
        try {
            // If shipping method changed, update it
            if (deliveryMethod && activeOrder?.shippingLines[0]?.shippingMethod.id !== deliveryMethod) {
                await changeShippingMethod(deliveryMethod);
            }

            // Check if we can move the order to "ArrangingPayment"
            const { nextOrderStates } = await storefrontApiQuery(ctx)({
                nextOrderStates: true,
            });
            if (!nextOrderStates.includes('ArrangingPayment')) {
                setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
                return;
            }

            // If user entered a company, check VAT
            const vatValue = billing.customFields?.vatNumber || '';
            if (billing.company) {
                if (!vatValue.trim()) {
                    setError('billing.customFields.vatNumber', {
                        message: t('orderForm.errors.vatNumber.required'),
                    });
                    return;
                }
                const vatResult = await checkVAT(vatValue, billing.countryCode);
                if (!vatResult.valid) {
                    setError('billing.customFields.vatNumber', {
                        message: t('orderForm.errors.vatNumber.invalid'),
                    });
                    return;
                }
                // If VIES returns a different company name, update it
                if (billing.company.trim() !== vatResult.name.trim()) {
                    setValue('billing.company', vatResult.name);
                    billing.company = vatResult.name;
                }
            }

            // Set billing address
            const { setOrderBillingAddress } = await storefrontApiMutation(ctx)({
                setOrderBillingAddress: [
                    {
                        input: {
                            ...billing,
                            defaultBillingAddress: false,
                            defaultShippingAddress: false,
                        },
                    },
                    {
                        __typename: true,
                        '...on Order': { id: true },
                        '...on NoActiveOrderError': { message: true, errorCode: true },
                    },
                ],
            });
            if (setOrderBillingAddress?.__typename !== 'Order') {
                setError('root', {
                    message: tErrors(`errors.backend.${setOrderBillingAddress.errorCode}`),
                });
                return;
            }

            // Set shipping address (same or different)
            if (shippingDifferentThanBilling) {
                const { setOrderShippingAddress } = await storefrontApiMutation(ctx)({
                    setOrderShippingAddress: [
                        {
                            input: {
                                ...shipping,
                                defaultBillingAddress: false,
                                defaultShippingAddress: false,
                            },
                        },
                        {
                            __typename: true,
                            '...on Order': { id: true },
                            '...on NoActiveOrderError': { message: true, errorCode: true },
                        },
                    ],
                });
                if (setOrderShippingAddress?.__typename === 'NoActiveOrderError') {
                    setError('root', {
                        message: tErrors(`errors.backend.NO_ACTIVE_ORDER_ERROR`),
                    });
                    return;
                }
            } else {
                const { setOrderShippingAddress } = await storefrontApiMutation(ctx)({
                    setOrderShippingAddress: [
                        {
                            input: {
                                ...billing,
                                defaultBillingAddress: false,
                                defaultShippingAddress: false,
                            },
                        },
                        {
                            __typename: true,
                            '...on Order': { id: true },
                            '...on NoActiveOrderError': { message: true, errorCode: true },
                        },
                    ],
                });
                if (setOrderShippingAddress?.__typename === 'NoActiveOrderError') {
                    setError('root', {
                        message: tErrors(`errors.backend.NO_ACTIVE_ORDER_ERROR`),
                    });
                    return;
                }
            }

            // If not logged in, create a new customer for the order
            if (enforceCreateAccount && !activeCustomer) {
                const { setCustomerForOrder } = await storefrontApiMutation(ctx)({
                    setCustomerForOrder: [
                        { input: { emailAddress, firstName, lastName, phoneNumber } },
                        {
                            __typename: true,
                            '...on Order': { id: true },
                            '...on AlreadyLoggedInError': { message: true, errorCode: true },
                            '...on EmailAddressConflictError': { message: true, errorCode: true },
                            '...on GuestCheckoutError': { message: true, errorCode: true },
                            '...on NoActiveOrderError': { message: true, errorCode: true },
                        },
                    ],
                });

                if (setCustomerForOrder?.__typename !== 'Order') {
                    if (setCustomerForOrder.__typename === 'EmailAddressConflictError') {
                        // Email exists, show login form
                        setEmailExists(true);
                        setShowLoginForm(true);
                        // Set a root-level error for more visibility
                        setError('root', {
                            message: t('orderForm.errors.emailAddress.exists'),
                        });
                        // Scroll to the error banner with offset to ensure it's visible
                        if (errorRef.current) {
                            // Add a small delay to ensure the banner is rendered
                            setTimeout(() => {
                                if (errorRef.current) {
                                    const yOffset = -100; // Adjust this value as needed for proper visibility
                                    const y =
                                        errorRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                }
                            }, 100);
                        }
                        setFocus('emailAddress');
                    } else {
                        setError('root', {
                            message: tErrors(`errors.backend.${setCustomerForOrder.errorCode}`),
                        });
                    }
                    return;
                }
            }

            // Move order to "ArrangingPayment"
            const { transitionOrderToState } = await storefrontApiMutation(ctx)({
                transitionOrderToState: [
                    { state: 'ArrangingPayment' },
                    {
                        __typename: true,
                        '...on Order': ActiveOrderSelector,
                        '...on OrderStateTransitionError': {
                            errorCode: true,
                            message: true,
                            fromState: true,
                            toState: true,
                            transitionError: true,
                        },
                    },
                ],
            });

            // Optionally register a full account (if password is provided)
            if (enforceCreateAccount && password) {
                await storefrontApiMutation(ctx)({
                    registerCustomerAccount: [
                        { input: { emailAddress, firstName, lastName, phoneNumber, password } },
                        {
                            __typename: true,
                            '...on MissingPasswordError': { message: true, errorCode: true },
                            '...on NativeAuthStrategyError': { message: true, errorCode: true },
                            '...on PasswordValidationError': {
                                errorCode: true,
                                message: true,
                                validationErrorMessage: true,
                            },
                            '...on Success': { success: true },
                        },
                    ],
                });
            }

            if (!transitionOrderToState) {
                setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
                return;
            }
            if (transitionOrderToState.__typename !== 'Order') {
                setError('root', {
                    message: tErrors(`errors.backend.${transitionOrderToState.errorCode}`),
                });
                return;
            }

            // If there's only one payment method available, automatically select it and proceed to confirmation
            if (eligiblePaymentMethods && eligiblePaymentMethods.length === 1) {
                // Handle payment with the only available method
                try {
                    const paymentMethod = eligiblePaymentMethods[0].code;
                    const { addPaymentToOrder } = await storefrontApiMutation(ctx)({
                        addPaymentToOrder: [
                            { input: { method: paymentMethod, metadata: {} } },
                            {
                                __typename: true,
                                '...on Order': {
                                    state: true,
                                    code: true,
                                    payments: { metadata: true },
                                },
                                '...on IneligiblePaymentMethodError': {
                                    message: true,
                                    errorCode: true,
                                    eligibilityCheckerMessage: true,
                                },
                                '...on NoActiveOrderError': {
                                    message: true,
                                    errorCode: true,
                                },
                                '...on OrderPaymentStateError': {
                                    message: true,
                                    errorCode: true,
                                },
                                '...on OrderStateTransitionError': {
                                    message: true,
                                    errorCode: true,
                                    fromState: true,
                                    toState: true,
                                    transitionError: true,
                                },
                                '...on PaymentDeclinedError': {
                                    errorCode: true,
                                    message: true,
                                    paymentErrorMessage: true,
                                },
                                '...on PaymentFailedError': {
                                    errorCode: true,
                                    message: true,
                                    paymentErrorMessage: true,
                                },
                            },
                        ],
                    });

                    if (addPaymentToOrder.__typename !== 'Order') {
                        setError('root', { message: tErrors(`errors.backend.${addPaymentToOrder.errorCode}`) });
                        return;
                    } else {
                        // If it's Mollie, handle redirect if needed
                        if (paymentMethod === 'connected-payment-method') {
                            const molliePayment = addPaymentToOrder.payments?.[0];
                            const redirectUrl = molliePayment?.metadata?.public?.redirectUrl;
                            if (redirectUrl) {
                                window.location.href = redirectUrl;
                                return;
                            }
                        }
                        // Otherwise proceed to confirmation
                        push(`/checkout/confirmation/${addPaymentToOrder.code}`);
                        return;
                    }
                } catch (error) {
                    console.error('Error processing payment:', error);
                    setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
                    return;
                }
            } else {
                // Multiple payment methods or no payment methods, proceed to payment selection
                push('/checkout/payment');
            }
        } catch (error) {
            console.error('Error during onSubmit:', error);
            setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
        }
    };

    // Handle successful login
    const handleLoginSuccess = async () => {
        try {
            // Refresh the page data after login
            await fetchActiveOrder();

            // Get the updated customer data
            const { activeCustomer } = await storefrontApiQuery(ctx)({
                activeCustomer: {
                    id: true,
                    lastName: true,
                    firstName: true,
                    emailAddress: true,
                    phoneNumber: true,
                    addresses: {
                        id: true,
                        fullName: true,
                        company: true,
                        streetLine1: true,
                        streetLine2: true,
                        city: true,
                        province: true,
                        postalCode: true,
                        phoneNumber: true,
                        defaultShippingAddress: true,
                        defaultBillingAddress: true,
                        country: {
                            code: true,
                            name: true,
                        },
                        customFields: {
                            vatNumber: true,
                        },
                    },
                },
            });

            if (activeCustomer) {
                // Find default addresses
                const defaultShippingAddress = activeCustomer.addresses?.find(
                    address => address.defaultShippingAddress,
                );
                const defaultBillingAddress = activeCustomer.addresses?.find(address => address.defaultBillingAddress);

                // Update form values with customer data
                setValue('emailAddress', activeCustomer.emailAddress);
                setValue('firstName', activeCustomer.firstName);
                setValue('lastName', activeCustomer.lastName);
                setValue('phoneNumber', activeCustomer.phoneNumber);
                setValue(
                    'shippingDifferentThanBilling',
                    defaultShippingAddress ? !isAddressesEqual(defaultShippingAddress, defaultBillingAddress) : false,
                );

                // Update shipping address
                if (defaultShippingAddress) {
                    setValue('shipping.fullName', defaultShippingAddress.fullName || '');
                    setValue('shipping.company', defaultShippingAddress.company || '');
                    setValue('shipping.streetLine1', defaultShippingAddress.streetLine1 || '');
                    setValue('shipping.streetLine2', defaultShippingAddress.streetLine2 || '');
                    setValue('shipping.city', defaultShippingAddress.city || '');
                    setValue('shipping.province', defaultShippingAddress.province || '');
                    setValue('shipping.postalCode', defaultShippingAddress.postalCode || '');
                    setValue('shipping.countryCode', defaultShippingAddress.country?.code || countryCode);
                    setValue(
                        'shipping.phoneNumber',
                        defaultShippingAddress.phoneNumber || activeCustomer.phoneNumber || '',
                    );
                    setValue('shipping.customFields.vatNumber', defaultShippingAddress.customFields?.vatNumber || '');
                }

                // Update billing address
                if (defaultBillingAddress) {
                    setValue('billing.fullName', defaultBillingAddress.fullName || '');
                    setValue('billing.company', defaultBillingAddress.company || '');
                    setValue('billing.streetLine1', defaultBillingAddress.streetLine1 || '');
                    setValue('billing.streetLine2', defaultBillingAddress.streetLine2 || '');
                    setValue('billing.city', defaultBillingAddress.city || '');
                    setValue('billing.province', defaultBillingAddress.province || '');
                    setValue('billing.postalCode', defaultBillingAddress.postalCode || '');
                    setValue('billing.countryCode', defaultBillingAddress.country?.code || countryCode);
                    setValue(
                        'billing.phoneNumber',
                        defaultBillingAddress.phoneNumber || activeCustomer.phoneNumber || '',
                    );
                    setValue('billing.customFields.vatNumber', defaultBillingAddress.customFields?.vatNumber || '');
                }
            }

            setShowLoginForm(false);
            setEmailExists(false);
        } catch (error) {
            console.error('Error updating form after login:', error);
            // Still hide the login form even if there's an error
            setShowLoginForm(false);
            setEmailExists(false);
        }
    };

    // If the cart is empty, show an empty cart message
    if (activeOrder?.totalQuantity === 0) {
        return (
            <Stack w100 column>
                <Stack column gap="2rem">
                    <TH2 size="2rem" weight={500}>
                        {t('orderForm.emptyCart')}
                    </TH2>
                    <EmptyCartDescription>
                        <Trans i18nKey="orderForm.emptyCartDescription" t={t} components={{ 1: <Link href="/" /> }} />
                    </EmptyCartDescription>
                </Stack>
            </Stack>
        );
    }

    // Otherwise, render the normal checkout form
    return (
        <Stack w100 column>
            {/* STEPS BAR at the top */}
            <StepsBar
                currentStep={1}
                steps={[
                    t('orderForm.steps.accountInformation'),
                    t('orderForm.steps.billingDetails'),
                    t('orderForm.steps.reviewPayment'),
                ]}
            />

            {/* Banner for any root-level errors */}
            <Banner ref={errorRef} clearErrors={() => clearErrors('root')} error={errors?.root} />

            {/* The form */}
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Container>
                    {/* LEFT COLUMN: the main form */}
                    <FormColumn>
                        {/* Login Form (only shown when user is not logged in) */}
                        {!activeCustomer?.id && showLoginForm && (
                            <LoginForm
                                onLoginSuccess={handleLoginSuccess}
                                fetchActiveOrder={fetchActiveOrder}
                                insideForm={true}
                            />
                        )}

                        {/* Contact / Account Information */}
                        <Stack column gap={50}>
                            <Stack column gap="2rem">
                                <Stack gap="0.75rem" itemsCenter style={{ height: '2.6rem' }}>
                                    <AnimatePresence>
                                        {!isSubmitting && (
                                            <BackButton href="/">
                                                <MoveLeft size={26} />
                                            </BackButton>
                                        )}
                                    </AnimatePresence>
                                    <TH2 size="30px" weight={600}>
                                        {t('orderForm.contactInfo')}
                                    </TH2>
                                </Stack>

                                <Stack w100 column gap={20}>
                                    <ResponsiveRow w100 gap={20}>
                                        <Input
                                            {...register('firstName')}
                                            placeholder={t('orderForm.placeholders.firstName')}
                                            label={t('orderForm.firstName')}
                                            error={errors.firstName}
                                            required
                                        />
                                        <Input
                                            {...register('lastName')}
                                            placeholder={t('orderForm.placeholders.lastName')}
                                            label={t('orderForm.lastName')}
                                            error={errors.lastName}
                                            required
                                        />
                                    </ResponsiveRow>
                                    <ResponsiveRow w100 gap={20}>
                                        <Input
                                            {...register('phoneNumber', {
                                                onChange: e => (e.target.value = e.target.value.replace(/[^0-9]/g, '')),
                                            })}
                                            placeholder={t('orderForm.placeholders.phoneNumber')}
                                            type="tel"
                                            label={t('orderForm.phone')}
                                            error={errors.phoneNumber}
                                            required
                                        />
                                        <Input
                                            {...register('emailAddress')}
                                            placeholder={t('orderForm.placeholders.emailAddress')}
                                            label={t('orderForm.emailAddress')}
                                            error={errors.emailAddress}
                                            required
                                            disabled={!!activeCustomer?.id}
                                        />
                                    </ResponsiveRow>

                                    {/* Password fields (only if user isn't logged in) */}
                                    {!activeCustomer?.id && (
                                        <CreateAccountWrapper>
                                            <ResponsiveRow w100 gap={20}>
                                                <Input
                                                    {...register('password', {
                                                        required: 'Password is required',
                                                    })}
                                                    type="password"
                                                    placeholder={t('orderForm.placeholders.password')}
                                                    label={t('orderForm.password')}
                                                    error={errors.password}
                                                    required
                                                />
                                                <Input
                                                    {...register('confirmPassword', {
                                                        required: 'Confirm password is required',
                                                        validate: value =>
                                                            value === watch('password') || 'Passwords do not match',
                                                    })}
                                                    type="password"
                                                    placeholder={t('orderForm.placeholders.confirmPassword')}
                                                    label={t('orderForm.confirmPassword')}
                                                    error={errors.confirmPassword}
                                                    required
                                                />
                                            </ResponsiveRow>
                                        </CreateAccountWrapper>
                                    )}
                                </Stack>
                            </Stack>

                            {/* Billing Information */}
                            <BillingWrapper column>
                                <TH2 size="30px" weight={600} style={{ marginBottom: '30px' }}>
                                    {t('orderForm.billingInfo')}
                                </TH2>
                                <Stack w100 column gap={20}>
                                    <ResponsiveRow w100 gap={20}>
                                        <Input
                                            {...register('billing.fullName')}
                                            placeholder={t('orderForm.placeholders.fullName')}
                                            label={t('orderForm.fullName')}
                                            error={errors.billing?.fullName}
                                            required
                                        />
                                        <Input
                                            {...register('billing.city')}
                                            placeholder={t('orderForm.placeholders.city')}
                                            label={t('orderForm.city')}
                                            error={errors.billing?.city}
                                            required
                                        />
                                    </ResponsiveRow>
                                    <ResponsiveRow w100 gap={20}>
                                        <Input
                                            {...register('billing.streetLine1')}
                                            placeholder={t('orderForm.placeholders.streetLine1')}
                                            label={t('orderForm.streetLine1')}
                                            error={errors.billing?.streetLine1}
                                            required
                                        />
                                        <Input
                                            {...register('billing.streetLine2')}
                                            placeholder={t('orderForm.placeholders.streetLine2')}
                                            label={t('orderForm.streetLine2')}
                                            error={errors.billing?.streetLine2}
                                        />
                                    </ResponsiveRow>
                                    <ResponsiveRow w100 gap={20}>
                                        <Input
                                            {...register('billing.province')}
                                            placeholder={t('orderForm.placeholders.province')}
                                            label={t('orderForm.province')}
                                            error={errors.billing?.province}
                                            required
                                        />
                                        <Input
                                            {...register('billing.postalCode')}
                                            placeholder={t('orderForm.placeholders.postalCode')}
                                            label={t('orderForm.postalCode')}
                                            error={errors.billing?.postalCode}
                                            required
                                        />
                                    </ResponsiveRow>
                                    <ResponsiveRow w100 gap="1.5rem">
                                        <Input
                                            {...register('billing.company')}
                                            placeholder={t('orderForm.placeholders.company')}
                                            label={t('orderForm.company')}
                                            error={errors.billing?.company}
                                        />
                                        {availableCountries && (
                                            <CountrySelect
                                                {...register('billing.countryCode')}
                                                label={t('orderForm.countryCode')}
                                                defaultValue={countryCode}
                                                options={availableCountries}
                                                error={errors.billing?.countryCode}
                                                required
                                            />
                                        )}
                                    </ResponsiveRow>
                                    <Stack
                                        style={{
                                            visibility: watch('billing.company') ? 'visible' : 'hidden',
                                            height: watch('billing.company') ? 'auto' : '0px',
                                        }}>
                                        <Input
                                            {...vatRegister}
                                            placeholder={t('orderForm.placeholders.customFields.vatNumber')}
                                            label={t('orderForm.customFields.vatNumber')}
                                            error={errors.billing?.customFields?.vatNumber}
                                            required={Boolean(watch('billing.company'))}
                                        />
                                    </Stack>
                                </Stack>
                            </BillingWrapper>
                        </Stack>

                        {/* Shipping Information */}
                        <Stack column gap={20} style={{ marginTop: '2rem' }}>
                            <Stack justifyBetween itemsCenter>
                                <CheckBox
                                    {...register('shippingDifferentThanBilling')}
                                    checked={watch('shippingDifferentThanBilling')}
                                    label={t('orderForm.shippingDifferentThanBilling')}
                                />
                            </Stack>

                            <AnimatePresence>
                                {watch('shippingDifferentThanBilling') && (
                                    <ShippingWrapper
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}>
                                        <TH2 size="30px" weight={600} style={{ marginBottom: '30px' }}>
                                            {t('orderForm.shippingInfo')}
                                        </TH2>
                                        <Stack column gap={20}>
                                            <ResponsiveRow w100 gap={20}>
                                                <Input
                                                    {...register('shipping.fullName')}
                                                    label={t('orderForm.fullName')}
                                                    error={errors.shipping?.fullName}
                                                    required
                                                />
                                                <Input
                                                    {...register('shipping.company')}
                                                    label={t('orderForm.company')}
                                                    error={errors.shipping?.company}
                                                />
                                            </ResponsiveRow>
                                            <ResponsiveRow w100 gap={20}>
                                                <Input
                                                    {...register('shipping.streetLine1')}
                                                    label={t('orderForm.streetLine1')}
                                                    error={errors.shipping?.streetLine1}
                                                    required
                                                />
                                                <Input
                                                    {...register('shipping.streetLine2')}
                                                    label={t('orderForm.streetLine2')}
                                                    error={errors.shipping?.streetLine2}
                                                    required
                                                />
                                            </ResponsiveRow>
                                            <ResponsiveRow w100 gap={20}>
                                                <Input
                                                    {...register('shipping.city')}
                                                    label={t('orderForm.city')}
                                                    error={errors.shipping?.city}
                                                    required
                                                />
                                                {availableCountries && (
                                                    <CountrySelect
                                                        {...register('shipping.countryCode')}
                                                        label={t('orderForm.countryCode')}
                                                        defaultValue={countryCode}
                                                        options={availableCountries}
                                                        error={errors.shipping?.countryCode}
                                                        required
                                                    />
                                                )}
                                            </ResponsiveRow>
                                            <ResponsiveRow gap={20}>
                                                <Input
                                                    {...register('shipping.province')}
                                                    label={t('orderForm.province')}
                                                    error={errors.shipping?.province}
                                                    required
                                                />
                                                <Input
                                                    {...register('shipping.postalCode')}
                                                    label={t('orderForm.postalCode')}
                                                    error={errors.shipping?.postalCode}
                                                    required
                                                />
                                            </ResponsiveRow>
                                        </Stack>
                                    </ShippingWrapper>
                                )}
                            </AnimatePresence>

                            <Stack column justifyBetween gap="0.5rem">
                                <CheckBox
                                    {...register('terms')}
                                    label={
                                        <Trans
                                            i18nKey="orderForm.terms"
                                            t={t}
                                            components={{
                                                1: (
                                                    <StyledLink
                                                        skipChannelHandling
                                                        style={{ zIndex: 2, position: 'relative' }}
                                                        href="/content/terms-and-conditions/"
                                                    />
                                                ),
                                            }}
                                        />
                                    }
                                    required
                                />
                                <AnimatePresence>
                                    {errors.terms?.message && (
                                        <FormError
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}>
                                            {errors.terms?.message}
                                        </FormError>
                                    )}
                                </AnimatePresence>
                            </Stack>
                        </Stack>
                    </FormColumn>

                    {/* RIGHT COLUMN: Order Summary */}
                    <SummaryColumn>
                        <OrderSummary
                            shipping={
                                shippingMethods ? (
                                    <DeliveryMethodWrapper>
                                        <DeliveryMethod
                                            selected={watch('deliveryMethod')}
                                            error={errors.deliveryMethod?.message}
                                            onChange={async id => {
                                                await changeShippingMethod(id);
                                                setValue('deliveryMethod', id);
                                                clearErrors('deliveryMethod');
                                            }}
                                            shippingMethods={shippingMethods}
                                            currencyCode={activeOrder?.currencyCode}
                                        />
                                    </DeliveryMethodWrapper>
                                ) : null
                            }
                            footer={
                                <Stack column gap="2.5rem" justifyCenter itemsCenter>
                                    <StyledButton disabled={isSubmitting} type="submit">
                                        <TP color="contrast">{t('orderForm.continueToPayment')}</TP>
                                    </StyledButton>
                                    <LinkButton skipChannelHandling href="/">
                                        {t('orderForm.continueShopping')}
                                    </LinkButton>
                                </Stack>
                            }
                        />
                    </SummaryColumn>
                </Container>
            </Form>
        </Stack>
    );
};

/* -----------------------------------
   Styled Components for Layout/Styling
----------------------------------- */

const Form = styled.form`
    margin-top: 1.6rem;
`;

const Container = styled(Stack)`
    /* 
    On mobile, stack in a column. 
    On larger screens, place columns side-by-side. 
  */
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: row;
        align-items: flex-start;
    }
`;

/** Left Column for the main form */
const FormColumn = styled.div`
    flex: 1; /* Grow to take available space */
    margin-right: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        margin-right: 0;
    }
`;

/** Right Column for the summary */
const SummaryColumn = styled.div`
    width: 600px;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 100%;
        margin-top: 2rem;
    }
`;

const BackButton = styled(Link)`
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.2rem;
    height: 3.2rem;
    color: ${({ theme }) => theme.gray(1000)};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        display: none;
    }
`;

const CreateAccountWrapper = styled(motion.div)`
    display: flex;
    gap: 1.25rem;
`;

const BillingWrapper = styled(Stack)`
    margin-top: 1.75rem;
`;

const ShippingWrapper = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    margin-top: 1.75rem;
`;

const DeliveryMethodWrapper = styled(Stack)``;

const StyledButton = styled(Button)`
    appearance: none;
    border: none;
    background: ${p => p.theme.background.accentGreen};
    text-transform: capitalize !important;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.6rem 0.8rem;
    border-radius: 12px;

    p {
        text-transform: capitalize !important;
        color: ${p => p.theme.background.white};
    }
    & > div {
        color: ${p => p.theme.background.white};
        text-align: center;
        font-weight: 600;
        font-size: 20px !important;
    }

    &:hover {
        border: 1px solid ${p => p.theme.background.accentGreen};
        p {
            text-transform: capitalize !important;
            color: ${p => p.theme.background.accentGreen};
        }
    }
`;

const LinkButton = styled(Link)`
    width: 100%;
    text-align: center;
    color: ${p => p.theme.text.main};
    font-size: 1.5rem;
    font-weight: 600;
`;

const StyledLink = styled(Link)`
    color: ${p => p.theme.text.accentGreen};
    text-decoration: none;
    &:hover {
        color: ${p => p.theme.text.accentGreen};
    }
`;

const EmptyCartDescription = styled.div`
    font-size: 1.75rem;
    & > a {
        font-weight: 500;
        font-size: 1.75rem;
        color: ${p => p.theme.accent(800)};
        text-decoration: underline;
    }
`;

/**
 * ResponsiveRow forces its children into a row on large screens
 * but stacks them vertically on mobile.
 */
const ResponsiveRow = styled(Stack)`
    flex-direction: row;
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;
