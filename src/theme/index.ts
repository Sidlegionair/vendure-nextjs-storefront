// Define levels as a type for color scaling
type Level = 0 | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;

// FunctionTheme: includes functions for accent, gray, and borderRadius settings.
type FunctionTheme = {
    accent: (l: Level) => string;
    gray: (l: Level) => string;
    grayAlpha: (l: Level, alpha: number) => string;
    borderRadius: string;
    withOpacity: (color: string, opacity: number) => string; // New function for opacity
};


// DetailTheme: Defines more specific parts of the theme, such as text colors, backgrounds, buttons, etc.
type DetailTheme = {
    text: {
        main: string;
        inactive: string;
        subtitle: string;
        contrast: string;
    };
    background: {
        main: string;
        secondary: string;
        third: string;
        ice: string;
        white: string;
        modal: string;
    };
    button: {
        back: string;
        front: string;
        hover?: {
            back?: string;
            front?: string;
        };
        icon: {
            front: string;
            back?: string;
        };
    };
    shadow: string;
    error: string;
    success: string;
    tile: {
        background: string;
        hover: string;
    };
    placeholder: string;
    noteCard: string;
    outline: string;
    breakpoints: {
        /** 576px */
        ssm: string;
        /** 640px */
        sm: string;
        /** 768px */
        md: string;
        /** 1024px */
        lg: string;
        /** 1280px */
        xl: string;
        /** 1536px */
        '2xl': string;
    };
    price: {
        default: string;
        discount: string;
    };
};

// MainTheme combines both the FunctionTheme and DetailTheme
export type MainTheme = FunctionTheme & DetailTheme;

// Default function to generate theme settings based on hue
const defaultThemeFunction = (hue: number): FunctionTheme => ({
    accent: (l: Level) => `lch(${100.0 - l / 10.0}% ${l / 10.0} ${hue});`,
    gray: (g: Level) => `lch(${100.0 - g / 10.0}% 0 0);`,
    grayAlpha: (g: Level, alpha: number) => `lch(${100.0 - g / 10.0}% 0 0 / ${alpha});`,
    borderRadius: '0rem',
    withOpacity: (color: string, opacity: number) => {
        // Convert hex color to RGBA with the given opacity
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
});

// Emotional type for theme context
type Emotional = {
    theme: MainTheme;
};

// Generic type generator to allow theme functions in DetailTheme
type Gen<T> = {
    [P in keyof T]: T[P] extends string ? (emotionHtmlTheme: Emotional) => string : Gen<T[P]>;
};

// Helper function to recursively transform the theme object
const themeTransform = (t: MainTheme): Gen<DetailTheme> => {
    const tree = (obj: Record<string, unknown>, prefix: string[] = []): void => {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string') {
                obj[key] = (fn: Emotional) => {
                    const result = prefix.concat(key).reduce(
                        (acc: Record<string, unknown> | string | undefined, prop) =>
                            typeof acc === 'object' && acc ? acc[prop] : undefined,
                        fn.theme as Record<string, unknown>,
                    );
                    return result as string;
                };
            } else if (value && typeof value === 'object') {
                tree(value as Record<string, unknown>, [...prefix, key]);
            }
        });
    };

    const { gray, accent, borderRadius, grayAlpha, ...rest } = t;
    const restCopy = JSON.parse(JSON.stringify(rest));
    tree(restCopy);
    return restCopy as Gen<DetailTheme>;
};

// Factory function to create a theme with hue and details
export const createTheme = (
    hue: number,
    fn: (t) => {
        border: { main: string };
        typography: {
            fontFamily: string;
            fontSize: { small: string; large: string; medium: string };
            fontWeight: { light: number; bold: number; italic: string; regular: number }
        };
        shadow: string;
        error: string;
        button: { border: string; icon: { front: string }; back: string; front: string };
        outline: string;
        vectors: { white: string; black: string; main: string };
        noteCard: string;
        background: {
            secondary: string;
            third: string;
            white: string;
            riderLevelBackground: string;
            groupBackground: string;
            main: string;
            ice: string;
            modal: string
        };
        success: string;
        price: { default: string; discount: string };
        tile: { hover: string; background: string };
        ellipse: { lightGray: string; backgroundDark: string; backgroundLight: string };
        text: {
            groupHeading: string;
            italicText: string;
            inactive: string;
            subtitle: string;
            contrast: string;
            black: string;
            main: string
        };
        placeholder: string;
        breakpoints: { xl: string; '2xl': string; md: string; sm: string; lg: string; ssm: string };
        opacity: { light: number; veryHeavy: number; medium: number; heavy: number }
    },
    themeFunction = defaultThemeFunction,
): MainTheme => {
    const baseTheme = themeFunction(hue);
    return {
        ...baseTheme,
        ...fn(baseTheme),
    };
};

// Example: Light theme definition
export const LightTheme = createTheme(300, (t) => ({
    background: {
        main: t.gray(0),
        secondary: t.gray(25),
        third: t.gray(50),
        ice: '#f8f8f8',
        white: '#ffffff',
        modal: 'rgba(0, 0, 0, 0.5)',
        groupBackground: 'rgba(255, 255, 255, 0.006)',
        riderLevelBackground: '#FFFFFF',
        accent: 'rgba(158, 46, 58, 1)',
        accentGreen: '#0E4632'
    },
    text: {
        main: `lch(9.72% 6.43 251.05)`,
        inactive: t.gray(200),
        subtitle: `lch(47.82% 6.77 249.38)`,
        contrast: t.gray(0),
        black: '#000000',
        groupHeading: '#FFFFFF',
        italicText: '#000000',
        accent: 'rgba(158, 46, 58, 1)',
        lightgray: '#B8B8B8',
        accentGreen: '#0E4632'
    },
    button: {
        back: '#141C23',
        front: t.gray(0),
        icon: { front: t.gray(900) },
        border: '#4D4D4D',
    },
    border: {
        main: '#4D4D4D',
        lightgray: '#BBBBBB',
    },
    shadow: `#69737c30`,
    error: '#eb1b19',
    success: '#1beb1b',
    price: {
        default: t.gray(1000),
        discount: '#FF8080',
    },
    tile: {
        background: '#69737c',
        hover: '#5b636b',
    },
    placeholder: '#9398a1',
    noteCard: '#ffff99',
    outline: '#dcdcdc',
    typography: {
        fontFamily: `'Suisse BP Int'l', sans-serif`,
        fontSize: {
            small: '14px',
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
    outline: '#dcdcdc',
    breakpoints: {
        ssm: '576px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',    // New breakpoint for large desktop screens
        '4xl': '2560px',     // New breakpoint for ultra-wide screens
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
        gray: '4D4D4D',
    },
    ellipse: {
        backgroundLight: '#000000',
        backgroundDark: '#4D4D4D',
        lightGray: '#5F5F5F',
    },
}));

// Transform the theme object for use in a UI
export const thv = themeTransform(LightTheme);
