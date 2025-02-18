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
        </section>
    );
};

export default CookieFirstComponent;
