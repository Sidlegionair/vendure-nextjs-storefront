import styled from '@emotion/styled';

export const MainGrid = styled.div`
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, max(240px, calc((100% - 60px) / 5))), 1fr));
    //gap: 1.5rem;
    gap: 70px;
    row-gap: 70px;

    @media (max-width: 768px) { /* Adjust for mobile */
        gap: 50px;
        row-gap: 50px;

        grid-template-columns: repeat(2, calc(50% - 60px)); /* Subtract padding from each column width */
    }
`;
