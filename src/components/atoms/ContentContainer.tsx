import styled from '@emotion/styled';

export const ContentContainer = styled.div`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    margin: auto;
    width: 1528px;
    padding: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints['3xl']}) {
        width: 1528px;
        padding: 0 4rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints['2xl']}) {
        width: 1280px;
        padding: 0 3rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        width: 1024px;
        padding: 0 2rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        width: 768px;
        padding: 0 1.5rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 640px;
        padding: 0 1rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
        padding: 0 0.5rem;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.ssm}) {
        width: 100%;
        padding: 0 0.25rem;
    }
`;
