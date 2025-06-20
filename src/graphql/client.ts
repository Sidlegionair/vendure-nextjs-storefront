import { GraphQLError, GraphQLResponse, Thunder, ZeusScalars, chainOptions, fetchOptions } from '@/src/zeus';
import { GetServerSidePropsContext } from 'next';
import { getContext } from '@/src/lib/utils';
let token: string | null = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;

/**
 * Convert a JS object/array/primitive into a string that
 * looks like valid GraphQL inline syntax.
 */
function encodeGraphQL(value: unknown): string {
    if (value === null) {
        return 'null';
    }
    // Arrays → "[item1, item2, ...]"
    if (Array.isArray(value)) {
        return '[' + value.map(item => encodeGraphQL(item)).join(', ') + ']';
    }
    // Objects → "{key: val, key2: val2, ...}"
    if (typeof value === 'object') {
        const entries = Object.entries(value).map(([k, v]) => {
            return `${k}: ${encodeGraphQL(v)}`;
        });
        return '{' + entries.join(', ') + '}';
    }
    // Strings → double-quoted, with internal quotes escaped
    if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`;
    }
    // Numbers, booleans, etc → as-is
    return String(value);
}

export const scalars = ZeusScalars({
    Money: {
        decode: e => e as number,
    },
    JSON: {
        encode: value => encodeGraphQL(value),
        decode: (e: unknown) => {
            if (typeof e === 'string') {
                try {
                    // Check if the string is valid JSON by parsing and re-stringifying
                    const parsed = JSON.parse(e);
                    if (typeof parsed === 'object' || Array.isArray(parsed)) {
                        return parsed; // Return parsed JSON for valid objects or arrays
                    }
                } catch (err) {
                    // If parsing fails, assume it's a plain string
                    // console.warn(`Warning: Input is not valid JSON, returning raw string: "${e}"`);
                    return e;
                }
            }
            // Return as-is if the input is not a string (already parsed or another type)
            return e;
        },
    },
    DateTime: {
        decode: (e: unknown) => new Date(e as string).toISOString(),
        encode: (e: unknown) => (e as Date).toISOString(),
    },
});

//use 'http://localhost:3000/shop-api/' in local .env file for localhost development and provide env to use on prod/dev envs

export const VENDURE_HOST = `${process.env.NEXT_PUBLIC_HOST || 'https://vendure-dev.aexol.com'}/shop-api`;

const apiFetchVendure =
    (options: fetchOptions) =>
    (query: string, variables: Record<string, unknown> = {}) => {
        const fetchOptions = options[1] || {};
        if (fetchOptions.method && fetchOptions.method === 'GET') {
            return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
                .then(handleFetchResponse)
                .then((response: GraphQLResponse) => {
                    if (response.errors) {
                        throw new GraphQLError(response);
                    }
                    return response.data;
                });
        }
        const additionalHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        // console.log(HEADERS);
        // console.log(additionalHeaders);
        // console.log(fetchOptions);
        const credentialsPolicy = 'include';

        return fetch(`${options[0]}`, {
            body: JSON.stringify({ query, variables }),
            method: 'POST',
            credentials: credentialsPolicy, // Dynamically set based on protocol
            headers: {
                'Content-Type': 'application/json',
                ...additionalHeaders,
            },
            ...fetchOptions,
        })
            .then(r => {
                const authToken = r.headers.get('vendure-auth-token');
                if (authToken != null) {
                    token = authToken;
                }
                return handleFetchResponse(r);
            })
            .then((response: GraphQLResponse) => {
                if (response.errors) {
                    throw new GraphQLError(response);
                }
                return response.data;
            });
    };

export const VendureChain = (...options: chainOptions) => Thunder(apiFetchVendure(options));

export const storefrontApiQuery = (ctx: { locale: string; channel: string }) => {
    const HOST = `${VENDURE_HOST}?languageCode=${ctx.locale}`;

    return VendureChain(HOST, {
        headers: {
            'Content-Type': 'application/json',
            'vendure-token': ctx.channel,
        },
    })('query', { scalars });
};

export const storefrontApiMutation = (ctx: { locale: string; channel: string }) => {
    const HOST = `${VENDURE_HOST}?languageCode=${ctx.locale}`;

    return VendureChain(HOST, {
        headers: {
            'Content-Type': 'application/json',
            'vendure-token': ctx.channel,
        },
    })('mutation', { scalars });
};

export const SSGQuery = (params: { locale: string; channel: string }) => {
    const reqParams = {
        locale: params?.locale as string,
        channel: params?.channel as string,
    };

    const HOST = `${VENDURE_HOST}?languageCode=${reqParams.locale}`;
    return VendureChain(HOST, {
        headers: {
            'Content-Type': 'application/json',
            'vendure-token': reqParams.channel,
        },
    })('query', { scalars });
};

export const SSRQuery = async (context: GetServerSidePropsContext) => {
    const authCookies = {
        session: context.req.cookies['session'],
        'session.sig': context.req.cookies['session.sig'],
    };

    const ctx = await getContext(context);
    const properChannel = ctx?.params?.channel as string;
    const locale = ctx?.params?.locale as string;

    // console.log('AuthCookies', context.req);

    const HOST = `${VENDURE_HOST}?languageCode=${locale}`;
    return VendureChain(HOST, {
        headers: {
            Cookie: `session=${authCookies['session']}; session.sig=${authCookies['session.sig']}`,
            'Content-Type': 'application/json',
            'vendure-token': properChannel,
        },
    })('query', { scalars });
};

export const SSRMutation = async (context: GetServerSidePropsContext) => {
    const authCookies = {
        session: context.req.cookies['session'],
        'session.sig': context.req.cookies['session.sig'],
    };
    // console.log('AuthCookies', context.req);

    const ctx = await getContext(context);
    const properChannel = ctx?.params?.channel as string;
    const locale = ctx?.params?.locale as string;

    const HOST = `${VENDURE_HOST}?languageCode=${locale}`;
    return VendureChain(HOST, {
        headers: {
            Cookie: `session=${authCookies['session']}; session.sig=${authCookies['session.sig']}`,
            'Content-Type': 'application/json',
            'vendure-token': properChannel,
        },
    })('mutation', { scalars });
};

const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
    if (!response.ok) {
        return new Promise((_, reject) => {
            response
                .text()
                .then(text => {
                    try {
                        reject(JSON.parse(text));
                    } catch (err) {
                        reject(text);
                    }
                })
                .catch(reject);
        });
    }
    return response.json() as Promise<GraphQLResponse>;
};
