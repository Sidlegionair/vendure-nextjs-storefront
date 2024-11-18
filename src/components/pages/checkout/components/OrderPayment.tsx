import { storefrontApiMutation } from '@/src/graphql/client';
import { AvailablePaymentMethodsType } from '@/src/graphql/selectors';
import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Stack, TP } from '@/src/components/atoms';
import { useCheckout } from '@/src/state/checkout';
import { Banner } from '@/src/components/forms';
import { useTranslation } from 'next-i18next';
import styled from '@emotion/styled';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/src/components/molecules/Button';
import { CreditCard } from 'lucide-react';
import { usePush } from '@/src/lib/redirect';
import { AnimatePresence, motion } from 'framer-motion';
import { useChannels } from '@/src/state/channels';

interface OrderPaymentProps {
    availablePaymentMethods?: AvailablePaymentMethodsType[];
    mollieData?: { paymentIntent: string | null };
}

type FormValues = {
    payment: string;
};

const POSITIVE_DEFAULT_PAYMENT_STATUSES = ['PaymentAuthorized', 'PaymentSettled'];

export const OrderPayment: React.FC<OrderPaymentProps> = ({ availablePaymentMethods, mollieData }) => {
    const ctx = useChannels();
    const { t } = useTranslation('checkout');
    const { t: tError } = useTranslation('common');
    const { activeOrder } = useCheckout();
    const push = usePush();
    const [error, setError] = useState<string | null>(null);

    const {
        watch,
        handleSubmit,
        register,
        formState: { isSubmitting, isValid },
    } = useForm<FormValues>({});

    const handlePayment = async (paymentMethod: string) => {
        try {
            setError(null);
            const { addPaymentToOrder } = await storefrontApiMutation(ctx)({
                addPaymentToOrder: [
                    { input: { method: paymentMethod, metadata: {} } },
                    {
                        __typename: true,
                        '...on Order': {
                            state: true,
                            code: true,
                            payments: {
                                metadata: true, // Metadata field now on payments
                            },
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
                // Handle non-Order result
                setError(tError(`errors.backend.${addPaymentToOrder.errorCode}`));
            } else if (POSITIVE_DEFAULT_PAYMENT_STATUSES.includes(addPaymentToOrder.state)) {
                // Check if the selected payment method is Mollie
                if (paymentMethod === 'connected-payment-method') {
                    const molliePayment = addPaymentToOrder.payments?.[0]; // Assuming the metadata is in the first payment

                    const redirectUrl = molliePayment?.metadata?.public?.redirectUrl; // Assuming redirect URL is stored in the metadata

                    if (redirectUrl) {
                        // Redirect to Mollie payment page
                        window.location.href = redirectUrl;
                    } else {
                        setError(tError(['errors.backend.MOLLIE_REDIRECT_FAILED'], { defaultValue: 'Mollie redirect failed' }));
                    }
                } else {
                    // Redirect to the confirmation page for non-Mollie payments
                    push(`/checkout/confirmation/${addPaymentToOrder.code}`);
                }
            }
        } catch (e) {
            console.error(e);
            setError(tError('errors.backend.UNKNOWN_ERROR'));
        }
    };


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        await handlePayment(data.payment);
    };

    return activeOrder ? (
        <Stack w100 column itemsCenter>
            <Banner error={{ message: error ?? undefined }} clearErrors={() => setError(null)} />
            <PaymentForm onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack w100 column style={{ position: 'relative' }}>
                    <CheckBox defaultChecked={true} type="checkbox" />
                    <GridTitle>
                        <TP size="1.5rem" weight={600}>
                            {t('paymentMethod.title')}
                        </TP>
                    </GridTitle>
                    <Grid>
                        {availablePaymentMethods?.map((method) => (
                            <GridEntry key={method.code} column itemsCenter justifyCenter>
                                <PaymentButton
                                    id={method.code}
                                    value={method.code}
                                    label={method.name}
                                    icon={<StyledCreditCard method={method.code} />}
                                    checked={watch('payment') === method.code}
                                    {...register('payment', { required: true })}
                                />
                            </GridEntry>
                        ))}
                    </Grid>
                </Stack>

                <AnimatePresence>
                    {isValid ? (
                        <AnimationStack initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Button disabled={isSubmitting} type="submit">
                                {t('paymentMethod.submit')}
                            </Button>
                        </AnimationStack>
                    ) : (
                        <Stack w100 justifyCenter>
                            <TP size="1.5rem" weight={600}>
                                {t('paymentMethod.selectToContinue')}
                            </TP>
                        </Stack>
                    )}
                </AnimatePresence>
            </PaymentForm>
        </Stack>
    ) : null;
};


const GridTitle = styled(Stack)`
    padding: 1.5rem 3rem;
    background-color: ${p => p.theme.gray(200)};
`;

const Grid = styled.div`
    margin-top: 1.5rem;
    display: grid;
    grid-template-rows: 0fr;

    transition: grid-template-rows 0.3s ease-in-out;
`;

const CheckBox = styled.input`
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 5.5rem;
    cursor: pointer;

    :checked ~ div {
        grid-template-rows: 1fr;
    }
`;

const GridEntry = styled(Stack)`
    overflow: hidden;
`;

const StyledCreditCard = styled(CreditCard)<{ method: string }>`
    color: ${({ theme }) => theme.success};
`;

const PaymentForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2rem;
    height: 100%;
`;

const AnimationStack = styled(motion.div)`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

type InputType = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon?: React.ReactNode;
};

const PaymentButton = forwardRef((props: InputType, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { label, icon, ...rest } = props;
    return (
        <Stack w100 column itemsCenter gap="0.25rem">
            <StyledButton style={{ width: '100%', justifyContent: 'start' }} active={rest.checked}>
                {icon}
                <AbsoluteRadio ref={ref} {...rest} type="radio" />
                <label htmlFor={props.name}>{label}</label>
            </StyledButton>
        </Stack>
    );
});

const AbsoluteRadio = styled.input`
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: pointer;
`;

const StyledButton = styled.button<{ active?: boolean }>`
    position: relative;
    display: flex;
    gap: 3.5rem;
    align-items: center;
    justify-content: center;
    background-color: ${p => (p.active ? p.theme.background.ice : p.theme.gray(0))};
    border: 1px solid ${p => p.theme.background.ice};
    border-radius: 0.25rem;
    padding: 1.5rem 3rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: ${p => p.theme.background.ice};
    }
`;
