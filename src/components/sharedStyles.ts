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
    | 3.125
    | 3.5
    | 3.75
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
export type BasePixelUnit = `${number}px`; // Add support for pixel units.

export interface BaseFlexParams {
    gap?: BaseRemUnit | BasePixelUnit | number | undefined; // Allow rem, px, and numbers.
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
