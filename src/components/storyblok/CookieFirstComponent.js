import React from 'react';
import { storyblokEditable } from '@storyblok/react';

const CookieFirstComponent = ({ blok }) => {
    return (
        <section {...storyblokEditable(blok)}>
            <div id="cookiefirst-policy-page"></div>
            <div>
                This cookie policy has been created and updated by{' '}
                <a href="https://cookiefirst.com/cookie-consent/">Cookie Consent</a>.
            </div>
            {/*<div id="cookiefirst-cookies-table"></div>*/}
            {/*<div>*/}
            {/*    This cookie table has been created and updated by the{' '}*/}
            {/*    <a href="https://cookiefirst.com/cookie-policy-generator/">*/}
            {/*        Cookie Policy Generator - CookieFirst*/}
            {/*    </a>.*/}
            {/*</div>*/}
        </section>
    );
};

export default CookieFirstComponent;
