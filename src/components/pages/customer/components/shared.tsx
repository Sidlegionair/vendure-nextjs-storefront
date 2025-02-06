import { Stack } from '@/src/components/atoms/Stack';
import styled from '@emotion/styled';

export const FormContainer = styled(Stack)`
    width: 100%;
    min-height: calc(100vh - 6rem);
    flex-direction: column;
    gap: 3.5rem;
    justify-content: center;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        min-height: 60vh;
    }
`;

export const FormWrapper = styled(Stack)`
    position: relative;
    padding: 90px 65px;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid #4D4D4D;
    align-items: center;
    width: fit-content;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-width: 480px;
    //max-width: 27.5rem;
    
    @media(max-width: ${({ theme }) => theme.breakpoints.md}) {
        min-width: 100%;
    }
`;

export const Absolute = styled(Stack)`
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
`;

export const FormContent = styled(Stack)`
    min-width: 32rem;
    max-width: 700px;
`;

export const CustomerWrap = styled(Stack)`
    //min-height: calc(100vh - 10rem);
    padding: 2rem 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
    }
`;
