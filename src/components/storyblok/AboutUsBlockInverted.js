import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';
import Link from 'next/link';

const AboutUsBlockInverted = ({ blok }) => {
    // Render and sanitize the rich text content
    const htmlContent = renderRichText(blok.description);
    const sanitizedContent = sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'button']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height', 'class', 'srcset'],
            button: ['href', 'target'],
        },
    });

    return (
        <section className="about-us-section">
            <div
                className="about-us-container"
                style={{
                    backgroundImage: `url(${blok.image?.filename})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                }}
            >
                {/* Text Content */}
                <div
                    className="about-us-text"
                    style={{ backgroundColor: blok.backgroundColor || '#9E2E3A' }}
                >
                    <h2>{blok.title || 'About Us'}</h2>
                    <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    {blok.buttonLink && (
                        <a style={{ color: blok.backgroundColor}} className="learn-more-button" href={blok.buttonLink.url.cached_url}>
                            {blok.buttonText || 'Learn More'} →
                        </a>
                    )}
                </div>
            </div>

            <style jsx>{`
                .about-us-section {
                    //position: relative;
                    //width: 100%;
                    //max-width: 100vw;
                    //overflow: hidden;

                    position: relative;
                    width: 100%;
                    max-width: 100vw;
                    height: 737px; /* Fixed height to ensure layout consistency */

                    //height: auto;
                    color: #fff;
                    overflow: hidden;
                    @media(max-width: 767px) {
                        overflow: unset;
                        height: 887px; /* Fixed height to ensure layout consistency */
                        padding-bottom: 150px;

                    }

                }

                .about-us-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    height: 100%;
                    background-size: cover;
                    //background-position: top center;
                    margin-right: 100px; /* Offset to create the left gap */
                    @media(max-width: 767px) {
                        margin-right: 0;
                        align-items: end;

                    }
                }

                .about-us-text {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-right: -100px;
                    height: 443px;
                    width: 50vw;
                    //max-width: 500px;
                    padding: 2rem;
                    color: #FFFFFF;
                    text-align: right;
                    background-color: rgba(14, 70, 50, 0.95); /* Semi-transparent background for readability */
                    padding: 82px 192px 82px 82px;
                    z-index: 2;

                    @media (max-width: 767px) {
                        margin-bottom: -200px;
                        //margin-bottom: 0;
                        margin-right: 0;
                        width: 95vw;
                        padding: 50px 30px;
                        height: 440px;
                    }
                }

                .about-us-text h2 {
                    font-size: 65px;
                    font-weight: 600;
                    line-height: 65px;
                    margin-bottom: 1.25rem;

                    @media (max-width: 767px) {
                        font-size: 50px;
                        line-height: 50px;
                    }
                }
                
                .rich-text-content {
                    p {
                        font-family: 'Calibri', sans-serif;
                        font-size: 20px;
                        font-weight: 400;
                        line-height: 26px;
                        margin-bottom: 1.25rem;

                        @media (max-width: 767px) {
                            font-size: 18px;
                            line-height: 26px;
                        }
                    }
                }
                
                    .learn-more-button {
                        display: inline-block;
                        padding: 18px 30px;
                        background-color: #FFFFFF;
                        color: #9E2E3A;
                        border-radius: 8px;
                        text-decoration: none;
                        margin-top: 1rem;
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 20px;
                    }
                }
            `}</style>
        </section>
    );
};

export default AboutUsBlockInverted;
