import React, { useState, forwardRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import styled from '@emotion/styled';
import { storefrontApiMutation } from '@/src/graphql/client';
import { AvailablePaymentMethodsType } from '@/src/graphql/selectors';
import { Stack } from '@/src/components/atoms/Stack';
import { TP } from '@/src/components/atoms/TypoGraphy';
import { Banner } from '@/src/components/forms';
import { Button } from '@/src/components/molecules/Button';
import { CreditCard } from 'lucide-react';
import { useCheckout } from '@/src/state/checkout';
import { usePush } from '@/src/lib/redirect';
import { useChannels } from '@/src/state/channels';

interface OrderPaymentProps {
    availablePaymentMethods?: AvailablePaymentMethodsType[];
    mollieData?: { paymentIntent: string | null };
}

type FormValues = {
    payment: string;
};

const POSITIVE_DEFAULT_PAYMENT_STATUSES = ['PaymentAuthorized', 'PaymentSettled'];

export const OrderPayment: React.FC<OrderPaymentProps> = ({
                                                              availablePaymentMethods,
                                                              mollieData,
                                                          }) => {
    const { t } = useTranslation('checkout');
    const { t: tError } = useTranslation('common');
    const { activeOrder } = useCheckout();
    const push = usePush();
    const ctx = useChannels();
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
                setError(tError(`errors.backend.${addPaymentToOrder.errorCode}`));
            } else if (POSITIVE_DEFAULT_PAYMENT_STATUSES.includes(addPaymentToOrder.state)) {
                if (paymentMethod === 'connected-payment-method') {
                    const molliePayment = addPaymentToOrder.payments?.[0];
                    const redirectUrl = molliePayment?.metadata?.public?.redirectUrl;
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        setError(
                            tError(['errors.backend.MOLLIE_REDIRECT_FAILED'], {
                                defaultValue: 'Mollie redirect failed',
                            })
                        );
                    }
                } else {
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

    if (!activeOrder) return null;

    return (
        <Stack w100 column itemsCenter>
            <Banner error={{ message: error ?? undefined }} clearErrors={() => setError(null)} />
            <PaymentForm onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack w100 column style={{ position: 'relative' }}>
                    <HiddenCheckBox defaultChecked type="checkbox" />
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
                        <MotionContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Button disabled={isSubmitting} type="submit">
                                {t('paymentMethod.submit')}
                            </Button>
                        </MotionContainer>
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
    );
};

// Styled Components

const PaymentForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2rem;
    height: 100%;
`;

const HiddenCheckBox = styled.input`
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 5.5rem;
    cursor: pointer;

    :checked ~ div {
        grid-template-rows: 1fr;
    }
`;

const Grid = styled.div`
    margin-top: 1.5rem;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-in-out;
`;

const GridEntry = styled(Stack)`
    overflow: hidden;
`;

const StyledCreditCard = styled(CreditCard)<{ method: string }>`
    color: ${({ theme }) => theme.background.accentGreen};
`;

const MotionContainer = styled(motion.div)`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

type PaymentButtonProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon?: React.ReactNode;
};

const PaymentButton = forwardRef<HTMLInputElement, PaymentButtonProps>(
    ({ label, icon, ...rest }, ref) => {
        return (
            <Stack w100 column itemsCenter gap="0.25rem">
                <StyledRadioButton active={rest.checked} style={{ width: '100%', justifyContent: 'start' }}>
                    {icon}
                    <AbsoluteRadio ref={ref} {...rest} type="radio" />
                    <label htmlFor={rest.name}>{label}</label>
                </StyledRadioButton>
            </Stack>
        );
    }
);

const AbsoluteRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: pointer;
`;

const StyledRadioButton = styled.button<{ active?: boolean }>`
    position: relative;
    display: flex;
    gap: 3.5rem;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme, active }) =>
            active ? theme.background.white : null};
    border: 1px solid ${({ theme }) => theme.background.ice};
    border-radius: 0.25rem;
    padding: 1.5rem 3rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.background.ice};
    }
`;
