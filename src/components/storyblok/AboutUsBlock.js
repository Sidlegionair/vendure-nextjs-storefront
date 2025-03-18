import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';

const AboutUsBlock = ({ blok }) => {
    const getButtonLink = (link) => {
        if (!link || !link.linktype) return null;
        if (link.linktype === 'url') return link.url;
        if (link.linktype === 'story') return `/${link.cached_url || ''}`;
        return null;
    };

    const buttonLink = getButtonLink(blok.buttonLink);

    return (
        <section className="about-us-section">
            <div className="about-us-container" style={{ backgroundColor: blok.backgroundColor || '#9E2E3A' }}>
                {/* Image Section */}
                <div className="about-us-image">
                    {blok.image && (
                        <img
                            src={blok.image.filename + '/m/'}
                            alt={blok.image.alt || 'About Us Image'}
                        />
                    )}
                </div>

                {/* Text Content */}
                <div className="about-us-text">
                    <h1>{blok.title || 'About Us'}</h1>
                    <div
                        className="rich-text-content"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(renderRichText(blok.description), {
                                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'button']),
                                allowedAttributes: {
                                    ...sanitizeHtml.defaults.allowedAttributes,
                                    img: ['src', 'alt', 'title', 'width', 'height', 'class', 'srcset'],
                                    button: ['href', 'target'],
                                },
                            }),
                        }}
                    />
                    {blok.buttonLink && blok.buttonLink.url !== "" && blok.buttonText && (
                        <a
                            className="learn-more-button"
                            href={buttonLink}
                            target={blok.buttonLink.target || '_self'}
                            rel={blok.buttonLink.target === '_blank' ? 'noopener noreferrer' : undefined}
                        >
                            {blok.buttonText} →
                        </a>
                    )}
                </div>
            </div>
            {/* Styles */}
            <style jsx>{`
                .about-us-section {
                    position: relative;
                    width: 100%;
                    max-width: 100vw;
                    color: #fff;
                    overflow: hidden;
                }

                .about-us-container {
                    display: flex;
                    align-items: center;
                    margin-left: 103px;
                    gap: 100px;
                }

                .about-us-image {
                    margin-left: -103px;
                    width: 50vw;
                    display: flex;
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
                    width: 50vw;
                    padding: 82px 192px 82px 82px;
                    margin-left: auto;
                    color: #FFFFFF;
                }

                .about-us-text h2 {
                    text-align: left;
                    margin-bottom: 1.25rem;
                }

                .rich-text-content p {
                    font-family: 'Calibri', sans-serif;
                    line-height: 26px;
                    text-align: left;
                    margin-bottom: 1.25rem;
                }

                .learn-more-button {
                    font-weight: bold;
                    display: inline-block;
                    padding: 18px 30px;
                    background-color: #FFFFFF;
                    color: #9E2E3A;
                    border-radius: 8px;
                    text-decoration: none;
                    margin-top: 1rem;
                    text-align: right;
                }

                @media (max-width: 768px) {
                    .about-us-section {
                        overflow: unset;
                        margin-top: 200px;
                    }

                    .about-us-container {
                        display: flex;
                        flex-direction: column;
                        gap: 0;
                        margin-left: 0;
                    }

                    .about-us-image {
                        width: 95%;
                        height: 400px;
                        margin-top: -50%;
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
                        padding: 30px;
                        gap: 20px;
                        text-align: left;
                    }
                    
                    .rich-text-content p {
                        font-family: 'Calibri', sans-serif;
                        font-weight: 400;
                        font-size: 18px;
                        line-height: 26px;
                    }

                    .learn-more-button {
                        font-size: ${({ theme }) => theme.typography.fontSize.h6};
                        line-height: ${({ theme }) => theme.typography.fontSize.h6};
                    }
                }
            `}</style>
        </section>
    );
};

export default AboutUsBlock;
