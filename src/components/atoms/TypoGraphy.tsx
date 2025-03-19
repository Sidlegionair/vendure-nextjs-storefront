import { thv } from '@/src/theme';
import styled from '@emotion/styled';

export type BaseProps = {
    size?: string | number; // Now optional
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    upperCase?: boolean;
    capitalize?: boolean;
    color?: keyof (typeof thv)['text'];
    noWrap?: boolean;
    lineHeight?: string | number;
    italic?: boolean;
};


export const TypoGraphy = styled.div<BaseProps>`
    font-size: ${p => p.size};
    font-weight: ${p => p.weight};
    text-transform: ${p => (p.upperCase ? 'uppercase' : p.capitalize ? 'capitalize' : 'none')};
    color: ${p => (p.color ? thv.text[p.color] : thv.text.main)};
    white-space: ${p => (p.noWrap ? 'nowrap' : 'normal')};
    line-height: ${p => (p.lineHeight ? p.lineHeight : 'normal')};
    font-style: ${p => (p.italic ? 'italic' : 'normal')}; // Apply italic if enabled
`;

type TypoGraphyProps = Partial<Parameters<typeof TypoGraphy>[0]>;

export const TH1 = (props: TypoGraphyProps) => <TypoGraphy as="h1" {...props} />;
export const TH2 = (props: TypoGraphyProps) => <TypoGraphy as="h2" {...props} />;
export const AntiqueTH3 = styled((props: TypoGraphyProps) => (
    <TypoGraphy as="h3" {...props} />
))`
    font-family: 'Suisse BP Int\'l Antique', sans-serif;
`;
export const TCategory = (props: TypoGraphyProps) => <TypoGraphy weight={400} as="h2" {...props} />;

export const TP = (props: TypoGraphyProps) => <TypoGraphy size="18px" lineHeight="26px" weight={400} as="p" {...props} />;
export const TPriceBig = (props: TypoGraphyProps) => <TypoGraphy size="2.5rem" weight={700} as="p" {...props} />;

export const TFacetHeading = (props: TypoGraphyProps) => <TypoGraphy size="1.5rem" weight={400} as="div" {...props} />;
