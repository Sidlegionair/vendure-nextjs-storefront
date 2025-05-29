// Define levels as a type for color scaling
type Level = 0 | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

// Define breakpoints with a new type to ensure consistency
type BreakpointSizes = 'ssm' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type Breakpoints = Record<BreakpointSizes, string>;

// FunctionTheme: includes functions for accent, gray, and borderRadius settings.
type FunctionTheme = {
    accent: (l: Level) => string;
    gray: (l: Level) => string;
    grayAlpha: (l: Level, alpha: number) => string;
    borderRadius: string;
    withOpacity: (color: string, opacity: number) => string;
};

// DetailTheme: Defines detailed theme structure, with alignment to LightTheme properties.
type DetailTheme = {
    background: {
        main: string;
        secondary: string;
        third: string;
        ice: string;
        white: string;
        modal: string;
        groupBackground: string;
        riderLevelBackground: string;
        accent: string;
        accentGreen: string;
    };
    text: {
        main: string;
        white: string;
        inactive: string;
        subtitle: string;
        contrast: string;
        black: string;
        groupHeading: string;
        italicText: string;
        accent: string;
        lightgray: string;
        accentGreen: string;
    };
    button: {
        back: string;
        front: string;
        icon: { front: string; back: string };
        hover: { front: string; back: string };
        border: string;
    };
    border: {
        main: string;
        lightgray: string;
        thin: string;
    };
    shadow: string;
    error: string;
    success: string;
    price: {
        default: string;
        discount: string;
    };
    tile: {
        background: string;
        hover: string;
    };
    placeholder: string;
    noteCard: string;
    outline: string;
    typography: {
        fontFamily: string;
        fontSize: {
            small: string;
            h4: string;
            h6: string;
            medium: string;
            large: string;
        };
        fontWeight: {
            light: number;
            regular: number;
            bold: number;
            italic: string;
        };
    };
    breakpoints: Breakpoints;
    opacity: {
        light: number;
        medium: number;
        heavy: number;
        veryHeavy: number;
    };
    vectors: {
        main: string;
        white: string;
        black: string;
        gray: string;
    };
    ellipse: {
        backgroundLight: string;
        backgroundDark: string;
        lightGray: string;
    };
};

// MainTheme combines both the FunctionTheme and DetailTheme
export type MainTheme = FunctionTheme & DetailTheme;

// Helper function for theme transformation
type Emotional = {
    theme: MainTheme;
};

type Gen<T> = {
    [P in keyof T]: T[P] extends string ? (emotionHtmlTheme: Emotional) => string : Gen<T[P]>;
};

const themeTransform = (t: MainTheme): Gen<DetailTheme> => {
    const tree = (obj: Record<string, unknown>, prefix: string[] = []): void => {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string') {
                obj[key] = (fn: Emotional) => {
                    const result = prefix.concat(key).reduce(
                        (
                            acc: Record<string, unknown> | string | undefined,
                            prop: string,
                        ): string | Record<string, unknown> | undefined => {
                            if (typeof acc === 'object' && acc !== null) {
                                return acc[prop] as string | Record<string, unknown> | undefined;
                            }
                            return undefined;
                        },
                        fn.theme as Record<string, unknown>,
                    );
                    return result as string;
                };
            } else if (value && typeof value === 'object') {
                tree(value as Record<string, unknown>, [...prefix, key]);
            }
        });
    };

    // Skip destructuring the function properties to avoid ESLint warnings
    const { ...rest } = t;
    const restCopy = JSON.parse(JSON.stringify(rest));
    tree(restCopy);
    return restCopy as Gen<DetailTheme>;
};

// Factory function to create a theme with hue and details
export const createTheme = (
    hue: number,
    fn: (t: FunctionTheme) => DetailTheme, // Specify the type for 't' here
    themeFunction = defaultThemeFunction,
): MainTheme => {
    const baseTheme = themeFunction(hue);
    return {
        ...baseTheme,
        ...fn(baseTheme),
    };
};

const defaultThemeFunction = (hue: number): FunctionTheme => ({
    accent: l => `hsl(${hue}, 100%, ${l}%)`,
    gray: l => `hsl(0, 0%, ${l}%)`,
    grayAlpha: (l, alpha) => `hsla(0, 0%, ${l}%, ${alpha})`,
    borderRadius: '8px',
    withOpacity: (color, opacity) => {
        // Helper function to convert hex to RGB
        const hexToRgb = (hex: string): [number, number, number] => {
            let cleanHex = hex.replace('#', '');
            if (cleanHex.length === 3) {
                cleanHex = cleanHex
                    .split('')
                    .map(x => x + x)
                    .join('');
            }
            const bigint = parseInt(cleanHex, 16);
            return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        };

        // Check if color is hex, and convert to RGB if necessary
        let rgb: [number, number, number];
        if (color.startsWith('#')) {
            rgb = hexToRgb(color);
        } else if (color.startsWith('rgb') || color.startsWith('hsl')) {
            // Return the color directly if it is already in a valid format
            return color.replace(/(rgba?|hsla?)\((.*?)\)/, (_, prefix, inner) => `${prefix}(${inner}, ${opacity})`);
        } else {
            throw new Error(`Invalid color format: ${color}`);
        }

        // Return the color in RGBA format
        return `rgba(${rgb.join(', ')}, ${opacity})`;
    },
});

// Define default theme settings
export const LightTheme = createTheme(300, t => ({
    background: {
        main: '#fff',
        secondary: '#fff',
        third: '#fff',
        ice: '#f8f8f8',
        white: '#ffffff',
        modal: '#fff',
        groupBackground: 'rgba(255, 255, 255, 0.006)',
        riderLevelBackground: '#FFFFFF',
        accent: 'rgba(158, 46, 58, 1)',
        accentGreen: '#0E4632',
    },
    text: {
        main: `rgba(0, 0, 0, 1)`,
        white: '#ffff',
        inactive: t.gray(200),
        subtitle: `#4D4D4D`,
        contrast: t.gray(0),
        black: '#000000',
        groupHeading: '#FFFFFF',
        italicText: '#000000',
        accent: 'rgba(158, 46, 58, 1)',
        lightgray: '#B8B8B8',
        accentGreen: '#0E4632',
    },
    button: {
        back: '#FFFFFF',
        front: '#000',
        icon: { front: '#000000', back: '#fff' },
        hover: { front: t.gray(0), back: t.gray(100) }, // Added hover back
        border: '#4D4D4D',
    },
    border: {
        main: '#4D4D4D',
        lightgray: '#E7E7E7',
        thin: 'rgba(207, 207, 207, 1)',
    },
    shadow: `rgba(0, 0, 0, 0.12)`,
    error: '#eb1b19',
    success: '#1beb1b',
    price: {
        default: t.gray(1000),
        discount: '#FF8080',
    },
    tile: {
        background: '#EEEEEE',
        hover: '#5b636b',
    },
    placeholder: '#9398a1',
    noteCard: '#ffff99',
    outline: '#dcdcdc',
    typography: {
        fontFamily: `'Suisse BP Int'l', sans-serif`,
        fontSize: {
            small: '14px',
            h4: '30px',
            h6: '16px',
            medium: '20px',
            large: '24px',
        },
        fontWeight: {
            light: 300,
            regular: 500,
            bold: 600,
            italic: 'italic',
        },
    },
    breakpoints: {
        ssm: '576px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
    },
    opacity: {
        light: 0.2,
        medium: 0.5,
        heavy: 0.7,
        veryHeavy: 0.85,
    },
    vectors: {
        main: '#828282',
        white: '#FFFFFF',
        black: '#212121',
        gray: '#4D4D4D',
    },
    ellipse: {
        backgroundLight: '#000000',
        backgroundDark: '#4D4D4D',
        lightGray: '#5F5F5F',
    },
}));

// Transform the theme object for use in a UI
export const thv = themeTransform(LightTheme);
