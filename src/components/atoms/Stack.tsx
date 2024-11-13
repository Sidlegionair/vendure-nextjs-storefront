import { BaseFlexParams } from '@/src/components/sharedStyles';
import styled from '@emotion/styled';


export const Stack = styled.div<BaseFlexParams>`
    gap: ${({ gap = 0 }) => (typeof gap === 'number' ? `${gap}px` : gap)};
    display: flex;
    flex-direction: ${({ column, reverse }) =>
            column ? (reverse ? 'column-reverse' : 'column') : reverse ? 'row-reverse' : 'row'};
    flex-wrap: ${({ flexWrap }) => (flexWrap ? 'wrap' : 'nowrap')};
    justify-content: ${({ justifyBetween, justifyCenter, justifyEnd }) =>
            justifyBetween ? 'space-between' : justifyCenter ? 'center' : justifyEnd ? 'flex-end' : 'flex-start'};
    align-items: ${({ itemsCenter, itemsStart, itemsEnd }) =>
            itemsCenter ? 'center' : itemsStart ? 'flex-start' : itemsEnd ? 'flex-end' : 'stretch'};
    width: ${({ w100 }) => (w100 ? '100%' : 'auto')};
`
