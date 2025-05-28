import { Stack } from '@/src/components/atoms/Stack';
import styled from '@emotion/styled';

export const FormContainer = styled(Stack)`
    width: 100%;
    min-height: calc(100vh - 200px);
    flex-direction: column;
    gap: 3.5rem;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        min-height: 60vh;
    }
`;

export const FormWrapper = styled(Stack)`
    position: relative;
    padding: 60px 65px;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid #4D4D4D;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        padding: 50px 40px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: 40px 25px;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 480px;

    @media(max-width: ${({ theme }) => theme.breakpoints.md}) {
        max-width: 100%;
    }
`;

export const Absolute = styled(Stack)`
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
`;

export const FormContent = styled(Stack)`
    width: 100%;
    max-width: 700px;

    @media(max-width: ${({ theme }) => theme.breakpoints.md}) {
        max-width: 100%;
    }
`;

export const CustomerWrap = styled(Stack)`
    width: 100%;
    padding: 1.5rem 0;
    align-items: center;
    justify-content: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        gap: 2.5rem;
        padding: 1rem 0;
    }
`;
