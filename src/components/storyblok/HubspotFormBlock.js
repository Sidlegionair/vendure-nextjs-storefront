import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Script from 'next/script';

const HubspotFormBlock = ({ blok }) => {
    // Destructure configurable properties with sensible defaults
    const {
        portalId = "145432083",
        formId = "7169da37-5530-45a3-a6f5-13590b81a61c",
        region = "eu1",
        targetId = "hubspot-form-container",
    } = blok;

    return (
        <section className="hubspot-form-section" {...storyblokEditable(blok)}>
            {/* This div is where HubSpot will render the form */}
            <div id={targetId}></div>

            {/* External HubSpot script */}
            <Script
                src={`//js-${region}.hsforms.net/forms/embed/v2.js`}
                strategy="afterInteractive"
                charset="utf-8"
                type="text/javascript"
            />

            {/* Inline script to create the form */}
            <Script id="hubspot-inline" strategy="afterInteractive">
                {`
          if (window.hbspt) {
            window.hbspt.forms.create({
              portalId: "${portalId}",
              formId: "${formId}",
              target: "#${targetId}"
            });
          }
        `}
            </Script>

            <style jsx>{`
        .hubspot-form-section {
          width: 100%;
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
        </section>
    );
};

export default HubspotFormBlock;
