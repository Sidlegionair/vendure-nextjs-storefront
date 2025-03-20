import styled from '@emotion/styled';

export const Label = styled.label`
    text-transform: none;
    //font-weight: bold;
    font-size: ${p => p.theme.typography.fontSize.h6};

    & > a {
        color: ${p => p.theme.text.accentGreen};
        //font-weight: bold;
        text-decoration: underline;
    }
`;
