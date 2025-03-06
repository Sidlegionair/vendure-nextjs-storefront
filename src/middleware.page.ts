import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOCALE } from '@/src/lib/consts';

// Make sure your environment variable is set appropriately.
const DEFAULT_CHANNEL_SLUG = process.env.DEFAULT_CHANNEL_SLUG || 'r5fw4nd3b8cd8lhz21o';

export function middleware(request: NextRequest) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    console.log('URL segments:', pathSegments);

    let channel = DEFAULT_CHANNEL_SLUG;
    let locale = DEFAULT_LOCALE;

    // If the first segment is a valid locale, use that (and assume default channel).
    if (pathSegments.length > 0 && ['nl', 'en'].includes(pathSegments[0].toLowerCase())) {
        locale = pathSegments[0].toLowerCase();
        // channel remains the default channel.
    } else if (pathSegments.length > 0) {
        // Otherwise, assume the first segment is the channel slug.
        channel = pathSegments[0];
        if (pathSegments.length > 1 && ['nl', 'en'].includes(pathSegments[1].toLowerCase())) {
            locale = pathSegments[1].toLowerCase();
        }
    }

    // If the channel is the default channel and it's explicitly in the URL,
    // remove it and redirect.
    if (channel === DEFAULT_CHANNEL_SLUG && pathSegments[0] === DEFAULT_CHANNEL_SLUG) {
        const newPathSegments = pathSegments.slice(1);
        const newPath = '/' + newPathSegments.join('/');
        console.log('Redirecting to:', newPath || '/');
        return NextResponse.redirect(new URL(newPath || '/', url));
    }

    const response = NextResponse.next();
    response.cookies.set('channel', channel, { path: '/' });
    response.cookies.set('i18next', locale, { path: '/' });
    response.headers.set('x-channel', channel);
    return response;
}

export const config = {
    matcher: `/((?!api|_next/static|_next/image|favicon.ico|fonts).*)`,
};
