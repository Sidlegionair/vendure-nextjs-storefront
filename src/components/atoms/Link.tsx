import React, { PropsWithChildren } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { DEFAULT_CHANNEL_SLUG } from '@/src/lib/consts';

const notTranslatedLinks: string[] = [];

interface LinkComponentProps extends LinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    skipLocaleHandling?: boolean;
    skipChannelHandling?: boolean;
    external?: boolean;
    ariaLabel?: string;
}

export const Link: React.FC<PropsWithChildren<LinkComponentProps>> = ({
    children,
    skipLocaleHandling,
    skipChannelHandling,
    external,
    ariaLabel,
    href,
    ...rest
}) => {
    const router = useRouter();
    const locale = (rest.locale || router.query.locale || '') as string;
    const channel = (router.query.channel || '') as string;
    let linkHref = (href || router.asPath) as string;

    if (linkHref.indexOf('http') === 0) skipLocaleHandling = true;
    if (notTranslatedLinks.find(ntl => linkHref.startsWith(ntl))) skipLocaleHandling = true;

    const _channel =
        channel && !skipChannelHandling
            ? channel === DEFAULT_CHANNEL_SLUG && !router.query.locale
                ? ''
                : `/${router.query.channel}`
            : '';

    if (!skipLocaleHandling) {
        linkHref = href
            ? `${_channel}${locale ? `/${locale}` : ''}${linkHref}`
            : router.pathname.replace('/[channel]', _channel).replace('/[locale]', `/${locale}`);
    }

    return (
        <NextLink href={linkHref} passHref {...(external && { target: '_blank' })} aria-label={ariaLabel} {...rest}>
            {children}
        </NextLink>
    );
};
