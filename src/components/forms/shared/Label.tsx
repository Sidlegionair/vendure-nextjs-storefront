import styled from '@emotion/styled';

export const Label = styled.label`
    text-transform: none;
    font-weight: bold;

    & > a {
        color: ${p => p.theme.text.accentGreen};
        font-weight: bold;
        text-decoration: underline;
    }
`;
