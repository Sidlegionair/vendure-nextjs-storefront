import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';
import Image from 'next/image';
import Link from 'next/link';

const AboutUsBlock = ({ blok }) => {
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
            <div className="about-us-container" style={{ backgroundColor: blok.backgroundColor || '#9E2E3A' }}>
                {/* Image Section */}
                <div className="about-us-image">
                    {blok.image && (
                        <img
                            src={blok.image.filename}
                            alt={blok.image.alt || 'About Us Image'}
                        />
                    )}
                </div>

                {/* Text Content */}
                <div className="about-us-text">
                    <h2>{blok.title || 'About Us'}</h2>
                    <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    {blok.buttonLink && (
                        <a className="learn-more-button" href={blok.buttonLink.url.cached_url}>
                            {blok.buttonText || 'Learn More'} →
                        </a>
                    )}
                </div>
            </div>

            <style jsx>{`
                .about-us-section {
                    position: relative;
                    width: 100%;
                    max-width: 100vw;
                    height: auto;
                    color: #fff;
                    overflow: hidden;
                }

                .about-us-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    margin-left: 103px;
                    gap: 100px;
                }

                .about-us-image {
                    margin-left: -103px;
                    width: 50vw;
                    display: flex;
                    height: 100%;
                }

                .about-us-image img {
                    width: 100%;
                    height: 578.72px;
                    margin: 80px 0%;
                    object-fit: cover;
                    object-position: center top;
                }

                .about-us-text {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: space-between;
                    height: 409px;

                    position: relative;
                    width: 50vw;
                    padding: 82px 192px 82px 82px;
                    margin-left: auto;
                    color: #FFFFFF;
                }

                .about-us-text h2 {
                    font-size: 65px;
                    font-weight: 600;
                    line-height: 65px;
                    text-align: left;
                    margin-bottom: 1.25rem;
                }

                .rich-text-content p {
                    font-family: 'Calibri', sans-serif;
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 26px;
                    text-align: left;
                    margin-bottom: 1.25rem;
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
                    text-align: right;
                }

                @media (max-width: 768px) {
                    
                    .about-us-section {
                        //position: unset;
                        overflow: unset;
                        margin-top: 200px;
                    }
                    
                    
                    .about-us-container {
                        display: flex;
                        //position: unset;
                        flex-direction: column;
                        gap: 0;
                        margin-left: 0;
                    }

                    .about-us-image {
                        width: 95%;
                        left: 0;
                        //margin: 0 auto;
                        //position: relative;
                        height: 400px;
                        //overflow: hidden;
                        //position: absolute;
                        margin-top: -50%;
                        //top: -50%; /* Overlapping the red square */

                    }

                    .about-us-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center top;
                    }

                    .about-us-text {
                        margin-top: 100px;
                        width: 100%;
                        //margin: 0 0;
                        padding: 30px;
                        gap: 20px;
                        text-align: left;
                    }

                    .about-us-text h2 {
                        font-size: 50px;
                        line-height: 50px;
                    }

                    .rich-text-content p {
                        font-size: 18px;
                        line-height: 26px;
                    }

                    .learn-more-button {
                        font-size: 16px;
                        line-height: 16px;
                    }
                }
            `}</style>
        </section>
    );
};

export default AboutUsBlock;
