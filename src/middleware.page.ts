import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOCALE } from '@/src/lib/consts';
// import { DEFAULT_CHANNEL_SLUG, DEFAULT_LOCALE } from './lib/consts';
const DEFAULT_CHANNEL_SLUG = process.env.DEFAULT_CHANNEL_SLUG || 'default-channel';

export function middleware(request: NextRequest) {
    // console.log(request);
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    console.log('URL:', pathSegments);

    // If the first segment is 'nl' or 'en', treat that as the language.
    // If there's a second segment and it's also 'nl' or 'en', use that as the locale.
    // Otherwise, if only one segment exists, use it as the locale.
    if (pathSegments.length > 0 && ['nl', 'en'].includes(pathSegments[0].toLowerCase())) {
        let locale = pathSegments[0].toLowerCase();

        if (pathSegments.length >= 2 && ['nl', 'en'].includes(pathSegments[1].toLowerCase())) {
            locale = pathSegments[1].toLowerCase();
        }

        console.log(locale, DEFAULT_CHANNEL_SLUG);

        // Set cookies so that your app/backend knows to use the DEFAULT_CHANNEL
        // and the determined locale.



        const response = NextResponse.next();
        response.cookies.set('channel', DEFAULT_CHANNEL_SLUG, { path: '/' });
        response.cookies.set('i18next', locale, { path: '/' });
        response.headers.set('x-channel', DEFAULT_CHANNEL_SLUG);
        return response;
    }

    // If the URL doesn't start with 'nl' or 'en', fallback to defaults if needed.
    const response = NextResponse.next();
    if (!request.cookies.get('channel')) {
        response.cookies.set('channel', DEFAULT_CHANNEL_SLUG, { path: '/' });
    }
    if (!request.cookies.get('i18next')) {
        response.cookies.set('i18next', DEFAULT_LOCALE, { path: '/' });
    }
    response.headers.set('x-channel', DEFAULT_CHANNEL_SLUG);
    return response;
}

export const config = {
    matcher: `/((?!api|_next/static|_next/image|favicon.ico|fonts).*)`,
};