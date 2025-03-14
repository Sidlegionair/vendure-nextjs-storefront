import React from 'react';

import { TH2, TP } from '@/src/components/atoms/TypoGraphy';
import { Stack } from '@/src/components/atoms/Stack';
import { Button } from '@/src/components/molecules/Button';

import { usePush } from '@/src/lib/redirect';

import { storefrontApiMutation, storefrontApiQuery } from '@/src/graphql/client';
import {
    CreateAddressType,
    ShippingMethodType,
    AvailableCountriesType,
    CreateCustomerType,
    ActiveOrderSelector,
    ActiveCustomerType,
} from '@/src/graphql/selectors';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Trans, useTranslation } from 'next-i18next';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, FormError, Banner, CountrySelect, CheckBox } from '@/src/components/forms';
import { DeliveryMethod } from '../DeliveryMethod';
import { useValidationSchema } from './useValidationSchema';
import { Link } from '@/src/components/atoms/Link';
import { useCheckout } from '@/src/state/checkout';
import { Info, MoveLeft } from 'lucide-react';
import { baseCountryFromLanguage } from '@/src/util/baseCountryFromLanguage';
import { OrderSummary } from '../OrderSummary';
import { useChannels } from '@/src/state/channels';
import { Tooltip } from '@/src/components/molecules/Tooltip';

type FormValues = CreateCustomerType & {
    deliveryMethod?: string;
    shippingDifferentThanBilling?: boolean;
    shipping: CreateAddressType;
    billing: CreateAddressType;
    // userNeedInvoice?: boolean;
    // NIP?: string;
    createAccount?: boolean;
    password?: string;
    confirmPassword?: string;
    terms?: boolean;
};

interface OrderFormProps {
    availableCountries?: AvailableCountriesType[];
    activeCustomer: ActiveCustomerType | null;
    shippingMethods: ShippingMethodType[] | null;
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
const checkVAT = async (
    vatNumber: string,
    countryCode: string
): Promise<{ valid: boolean; name: string }> => {
    try {
        const vatWithoutPrefix = vatNumber.startsWith(countryCode)
            ? vatNumber.slice(countryCode.length)
            : vatNumber;
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

export const OrderForm: React.FC<OrderFormProps> = ({ availableCountries, activeCustomer, shippingMethods }) => {
    const ctx = useChannels();
    const { activeOrder, changeShippingMethod } = useCheckout();

    const { t } = useTranslation('checkout');
    const { t: tErrors } = useTranslation('common');
    const push = usePush();
    const schema = useValidationSchema();

    const errorRef = React.useRef<HTMLDivElement>(null);

    const defaultShippingAddress = activeCustomer?.addresses?.find(address => address.defaultShippingAddress);
    const defaultBillingAddress = activeCustomer?.addresses?.find(address => address.defaultBillingAddress);

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
            // NIP: defaultBillingAddress?.customFields?.NIP ?? '',
            // userNeedInvoice: defaultBillingAddress?.customFields?.NIP ? true : false,
        },
        values: activeCustomer
            ? {
                createAccount: false,
                emailAddress: activeCustomer.emailAddress,
                firstName: activeCustomer.firstName,
                lastName: activeCustomer.lastName,
                phoneNumber: activeCustomer.phoneNumber,
                //   NIP: defaultBillingAddress?.customFields?.NIP ?? '',
                //   userNeedInvoice: defaultBillingAddress?.customFields?.NIP ? true : false,
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
        console.log('Form Errors:', errors);
    }, [errors]);

    React.useEffect(() => {
        setValue('createAccount', false);
    }, [setValue]);

    const vatRegister = register('billing.customFields.vatNumber', {
        onChange: (e) => {
            console.log('VAT input changed:', e.target.value);
            setValue('billing.customFields.vatNumber', e.target.value, { shouldValidate: true });
        },
    });

    const enforceCreateAccount = !activeCustomer?.id;

    const onSubmit: SubmitHandler<FormValues> = async ({
                                                           emailAddress,
                                                           firstName,
                                                           lastName,
                                                           deliveryMethod,
                                                           billing,
                                                           shipping,
                                                           phoneNumber,
                                                           // NIP,
                                                           shippingDifferentThanBilling,
                                                           password,
                                                       }) => {
        try {
            if (deliveryMethod && activeOrder?.shippingLines[0]?.shippingMethod.id !== deliveryMethod) {
                await changeShippingMethod(deliveryMethod);
            }
            const { nextOrderStates } = await storefrontApiQuery(ctx)({ nextOrderStates: true });
            if (!nextOrderStates.includes('ArrangingPayment')) {
                setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
                return;
            }

            console.log('Billing before VAT check:', billing);
            const vatValue = billing.customFields?.vatNumber || '';
            if (billing.company) {
                if (!vatValue.trim()) {
                    console.log('VAT value is empty:', vatValue);
                    setError('billing.customFields.vatNumber', { message: t('orderForm.errors.vatNumber.required') });
                    return;
                }
                const vatResult = await checkVAT(vatValue, billing.countryCode);
                console.log('VAT result:', vatResult);
                if (!vatResult.valid) {
                    setError('billing.customFields.vatNumber', { message: t('orderForm.errors.vatNumber.invalid') });
                    return;
                }
                if (billing.company.trim() !== vatResult.name.trim()) {
                    console.log('Company name mismatch. Updating company name to:', vatResult.name);
                    setValue('billing.company', vatResult.name);
                    billing.company = vatResult.name;
                }
            }

            const { setOrderBillingAddress } = await storefrontApiMutation(ctx)({
                setOrderBillingAddress: [
                    {
                        input: {
                            ...billing,
                            defaultBillingAddress: false,
                            defaultShippingAddress: false,
                            // customFields: { NIP }
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
                setError('root', { message: tErrors(`errors.backend.${setOrderBillingAddress.errorCode}`) });
                return;
            }

            if (shippingDifferentThanBilling) {
                const { setOrderShippingAddress } = await storefrontApiMutation(ctx)({
                    setOrderShippingAddress: [
                        { input: { ...shipping, defaultBillingAddress: false, defaultShippingAddress: false } },
                        {
                            __typename: true,
                            '...on Order': { id: true },
                            '...on NoActiveOrderError': { message: true, errorCode: true },
                        },
                    ],
                });

                if (setOrderShippingAddress?.__typename === 'NoActiveOrderError') {
                    setError('root', { message: tErrors(`errors.backend.NO_ACTIVE_ORDER_ERROR`) });
                    return;
                }
            } else {
                const { setOrderShippingAddress } = await storefrontApiMutation(ctx)({
                    setOrderShippingAddress: [
                        { input: { ...billing, defaultBillingAddress: false, defaultShippingAddress: false } },
                        {
                            __typename: true,
                            '...on Order': { id: true },
                            '...on NoActiveOrderError': { message: true, errorCode: true },
                        },
                    ],
                });

                if (setOrderShippingAddress?.__typename === 'NoActiveOrderError') {
                    setError('root', { message: tErrors(`errors.backend.NO_ACTIVE_ORDER_ERROR`) });
                    return;
                }
            }

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
                        setError('emailAddress', {
                            message: tErrors(`errors.backend.${setCustomerForOrder.errorCode}`),
                        });
                        setFocus('emailAddress');
                    } else {
                        setError('root', { message: tErrors(`errors.backend.${setCustomerForOrder.errorCode}`) });
                    }
                    return;
                }
            }

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

            if (enforceCreateAccount && password) {
                await storefrontApiMutation(ctx)({
                    registerCustomerAccount: [
                        { input: { emailAddress, firstName, lastName, phoneNumber, password } },
                        {
                            __typename: true,
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
                            '...on Success': {
                                success: true,
                            },
                        },
                    ],
                });
            }

            if (!transitionOrderToState) {
                setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
                return;
            }

            if (transitionOrderToState?.__typename !== 'Order') {
                setError('root', { message: tErrors(`errors.backend.${transitionOrderToState.errorCode}`) });
                return;
            }
            push('/checkout/payment');
        } catch (error) {
            console.error("Error during onSubmit:", error);
            setError('root', { message: tErrors(`errors.backend.UNKNOWN_ERROR`) });
        }
    };

    return activeOrder?.totalQuantity === 0 ? (
        <Stack w100 column>
            <Stack column gap="2rem">
                <TH2 size="2rem" weight={500}>
                    {t('orderForm.emptyCart')}
                </TH2>
                <EmptyCartDescription>
                    <Trans i18nKey="orderForm.emptyCartDescription" t={t} components={{ 1: <Link href="/"></Link> }} />
                </EmptyCartDescription>
            </Stack>
        </Stack>
    ) : (
        <Stack w100 column>
            <Banner ref={errorRef} clearErrors={() => clearErrors('root')} error={errors?.root} />
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Container w100 gap={80}>
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
                                    <TP color="contrast">
                                        {t('orderForm.continueToPayment')}
                                    </TP>
                                </StyledButton>
                                <LinkButton skipChannelHandling href="/">{t('orderForm.continueShopping')}</LinkButton>
                            </Stack>
                        }
                    />
                    <Stack w100 column gap={50}>
                        <Stack column gap={50}>
                            {/* Customer Part */}
                            <Stack column gap="2rem">
                                <Stack gap="0.75rem" itemsCenter style={{ height: '2.6rem' }}>
                                    <AnimatePresence>
                                        {!isSubmitting ? (
                                            <BackButton href="/">
                                                <MoveLeft size={26} />
                                            </BackButton>
                                        ) : null}
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
                                        />
                                        <Input
                                            {...register('emailAddress')}
                                            placeholder={t('orderForm.placeholders.emailAddress')}
                                            label={t('orderForm.emailAddress')}
                                            error={errors.emailAddress}
                                            required
                                            disabled={activeCustomer?.id ? true : false}
                                        />
                                    </ResponsiveRow>
                                    {/* Password fields */}
                                    {!activeCustomer?.id && (
                                            <CreateAccountWrapper>
                                                <ResponsiveRow w100 gap={20}>

                                                <Input
                                                    {...register('password', { required: 'Password is required' })}
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

                            {/* Billing Part */}
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
                                        }}
                                    >
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
                        <Stack column gap={20}>
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
                                        transition={{ duration: 0.2 }}
                                    >
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
                                                1: <StyledLink skipChannelHandling style={{ zIndex: 2, position: 'relative' }} href="/content/terms-and-conditions/" />,
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
                                            transition={{ duration: 0.2 }}
                                        >
                                            {errors.terms?.message}
                                        </FormError>
                                    )}
                                </AnimatePresence>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </Form>
        </Stack>
    );
};

const Container = styled(Stack)`
    flex-direction: column-reverse;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: row-reverse;
    }
`;

const DeliveryMethodWrapper = styled(Stack)``;

const LinkButton = styled(Link)`
    width: 100%;
    text-align: center;
    color: ${p => p.theme.text.main};
    font-size: 1.5rem;
    font-weight: 600;
`;

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

const EmptyCartDescription = styled.div`
    font-size: 1.75rem;

    & > a {
        font-weight: 500;
        font-size: 1.75rem;
        color: ${p => p.theme.accent(800)};
        text-decoration: underline;
    }
`;

const BillingWrapper = styled(Stack)`
    margin-top: 1.75rem;
`;

const CreateAccountWrapper = styled(motion.div)`
    display: flex;
    gap: 1.25rem;
`;

const ShippingWrapper = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    margin-top: 1.75rem;
`;

const StyledLink = styled(Link)`
    color: ${p => p.theme.text.accentGreen};
    text-decoration: none;

    &:hover {
        color: ${p => p.theme.text.accentGreen};
    }
`;

const Form = styled.form`
    margin-top: 1.6rem;
`;

/**
 * ResponsiveRow forces its children into a row on larger screens but stacks them vertically on mobile.
 */
const ResponsiveRow = styled(Stack)`
    flex-direction: row;
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;
