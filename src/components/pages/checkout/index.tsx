import { CheckoutLayout } from '@/src/layouts';
import { InferGetServerSidePropsType } from 'next';
import React from 'react';
import { OrderForm } from './components/OrderForm';
import { useTranslation } from 'next-i18next';
import { getServerSideProps } from './props';
import { CheckoutCarousel } from './components/OrderSummary/CheckoutCarousel';
import styled from '@emotion/styled';
import { ContentContainer } from '@/src/components/atoms';

export const CheckoutPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = props => {
    const { t } = useTranslation('checkout');
    const { availableCountries, alsoBoughtProducts, eligibleShippingMethods, eligiblePaymentMethods, activeCustomer } =
        props;

    return (
        <CheckoutLayoutStyled pageTitle={`${t('seoTitles.checkout')}`}>
            <Content>
                <OrderForm
                    availableCountries={availableCountries}
                    shippingMethods={eligibleShippingMethods}
                    activeCustomer={activeCustomer}
                    eligiblePaymentMethods={eligiblePaymentMethods}
                />
                <CheckoutCarousel alsoBoughtProducts={alsoBoughtProducts} />
            </Content>
        </CheckoutLayoutStyled>
    );
};

const CheckoutLayoutStyled = styled(CheckoutLayout)`
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
        background: url('/images/bg/checkout.jpeg') no-repeat center center;
        background-size: cover;
        opacity: 0.2;
        z-index: -1; /* Set the background behind the content */
    }
`;

const Content = styled(ContentContainer)`
    position: relative;
    width: 1600px;
    padding: 0 4rem;

    @media (max-width: 1560px) {
        width: 1440px;
    }

    @media (min-width: 1560px) {
        max-width: 1528px;
    }
`;
