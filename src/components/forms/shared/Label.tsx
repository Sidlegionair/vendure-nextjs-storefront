import styled from '@emotion/styled';

export const Label = styled.label`
    text-transform: none;
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;

    & > a {
        color: ${p => p.theme.text.accentGreen};
        font-size: 16px;
        line-height: 16px;
        font-weight: 400;
        text-decoration: underline;
    }
`;
