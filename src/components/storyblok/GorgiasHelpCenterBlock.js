import React, { useEffect, useRef } from 'react';
import { storyblokEditable } from '@storyblok/react';

const GorgiasFormBlock = ({ blok }) => {
    const {
        formUid = "n923oe7z",
        scriptSrc = "https://contact.gorgias.help/api/contact-forms/loader.js?v=3",
    } = blok;

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Remove any existing script to prevent duplication
            const existingScript = containerRef.current.querySelector("script[data-gorgias-loader-contact-form]");
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement("script");
            script.src = scriptSrc;
            script.defer = true;
            script.setAttribute("data-gorgias-loader-contact-form", "");
            script.setAttribute("data-gorgias-contact-form-uid", formUid);
            containerRef.current.appendChild(script);
        }
    }, [scriptSrc, formUid]);

    return (
        <section className="gorgias-form-section" {...storyblokEditable(blok)}>
            <div className="gorgias-form-container" data-gorgias-contact-form="container" ref={containerRef}>
                <div data-gorgias-contact-form-uid={formUid}></div>
            </div>

            <style jsx>{`
                .gorgias-form-section {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .gorgias-form-container {
                    width: 100%;
                }
            `}</style>
        </section>
    );
};

export default GorgiasFormBlock;