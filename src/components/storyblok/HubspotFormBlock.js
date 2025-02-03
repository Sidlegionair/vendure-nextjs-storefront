import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Script from 'next/script';

const HubspotFormBlock = ({ blok }) => {
    const {
        portalId = "145432083",
        formId = "7169da37-5530-45a3-a6f5-13590b81a61c",
        region = "eu1",
        targetId = "hubspot-form-container",
    } = blok;

    return (
        <section className="hubspot-form-section" {...storyblokEditable(blok)}>
            {/* Container where HubSpot will render the form */}
            <div id={targetId}></div>

            {/* Load the external HubSpot script */}
            <Script
                src={`//js-${region}.hsforms.net/forms/embed/v2.js`}
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.hbspt) {
                        window.hbspt.forms.create({
                            portalId,
                            formId,
                            target: `#${targetId}`,
                        });
                    }
                }}
            />

            <style jsx>{`
        .hubspot-form-section {
          width: 100%;
        }
      `}</style>
        </section>
    );
};

export default HubspotFormBlock;
