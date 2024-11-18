type BaseUnit =
    | 0
    | 0.125
    | 0.25
    | 0.5
    | 0.75
    | 1.0
    | 1.25
    | 1.5
    | 1.75
    | 2
    | 2.5
    | 3
    | 3.5
    | 4
    | 5
    | 5.5
    | 6
    | 7
    | 8
    | 10
    | 12
    | 14
    | 16
    | 20
    | 24
    | 28
    | 32
    | 40
    | 48
    | 64;

export type BaseRemUnit = `${BaseUnit}rem`;

export interface BaseFlexParams {
    gap?: '0.125rem' | '0.25rem' | '0.5rem' | '0.75rem' | '1rem' | '1.25rem' |'1.5rem' | '1.75rem' | '2rem' | '2.5rem' | '3rem' | '3.5rem' | '4rem' | '5rem' | '6rem' | '12rem' | number | undefined;
    justifyEnd?: boolean;
    justifyCenter?: boolean;
    justifyBetween?: boolean;
    itemsCenter?: boolean;
    itemsStart?: boolean;
    itemsEnd?: boolean;
    column?: boolean;
    reverse?: boolean;
    flexWrap?: boolean;
    w100?: boolean;
}
