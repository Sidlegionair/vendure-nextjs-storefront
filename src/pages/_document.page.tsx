import Document, { Html, Head, Main, NextScript } from 'next/document';
import { SpeedInsights } from "@vercel/speed-insights/next";

export default class MyDocument extends Document {
    render(): JSX.Element {
        const lang = this?.props?.__NEXT_DATA__?.props?.pageProps?._nextI18Next?.initialLocale || 'en';

        return (
            <Html lang={lang}>
                <Head>
                    <meta name="robots" content="noindex" />

                    {/* Preconnect to the font provider */}
                    <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />

                    {/* Load Calibri font with optimization */}
                    <link
                        href="https://fonts.cdnfonts.com/css/calibri"
                        rel="stylesheet"
                        media="print"
                        onLoad="this.onload=null;this.removeAttribute('media');"
                    />

                    <noscript>
                        <link href="https://fonts.cdnfonts.com/css/calibri" rel="stylesheet" />
                    </noscript>
                </Head>
                <body>
                <Main />
                <NextScript />
                <SpeedInsights />
                </body>
            </Html>
        );
    }
}
