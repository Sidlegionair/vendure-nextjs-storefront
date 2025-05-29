import React, { useEffect, useRef } from 'react';
import { storyblokEditable } from '@storyblok/react';

const GorgiasHelpCenterBlock = ({ blok }) => {
    const {
        helpCenterUid = 'd7ztxq8n',
        scriptSrc = 'https://help-center.gorgias.help/api/help-centers/loader.js?v=2',
    } = blok;

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Remove any existing help center script to prevent duplication
            const existingScript = containerRef.current.querySelector('script[data-gorgias-loader-help-center]');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = scriptSrc;
            script.defer = true;
            script.setAttribute('data-gorgias-loader-help-center', '');
            script.setAttribute('data-gorgias-help-center-uid', helpCenterUid);
            containerRef.current.appendChild(script);
        }
    }, [scriptSrc, helpCenterUid]);

    return (
        <section className="gorgias-helpcenter-section" {...storyblokEditable(blok)}>
            <div className="gorgias-helpcenter-container" data-gorgias-help-center="container" ref={containerRef}>
                <div data-gorgias-help-center-uid={helpCenterUid}></div>
            </div>

            <style jsx>{`
                .gorgias-helpcenter-section {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .gorgias-helpcenter-container {
                    width: 100%;
                }
            `}</style>
        </section>
    );
};

export default GorgiasHelpCenterBlock;
