import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';

const AboutUsBlockInverted = ({ blok }) => {
    const htmlContent = renderRichText(blok.description);
    const sanitizedContent = sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'button']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height', 'class', 'srcset'],
            button: ['href', 'target'],
        },
    });

    const getButtonLink = (link) => {
        if (!link) return '#'; // Default fallback
        if (link.linktype === 'url') return link.url; // External URL
        if (link.linktype === 'story') return `/${link.cached_url || ''}`; // Internal Storyblok story
        return '#'; // Fallback for unknown types
    };

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
                    <h1>{blok.title || 'About Us'}</h1>
                    <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    {blok.buttonLink && blok.buttonLink.url !== "" && blok.buttonText && (
                        <a
                            style={{ color: blok.backgroundColor }}
                            className="learn-more-button"
                            href={getButtonLink(blok.buttonLink)}
                            target={blok.buttonLink.target || '_self'}
                            rel={blok.buttonLink.target === '_blank' ? 'noopener noreferrer' : undefined}
                        >
                            {blok.buttonText} →
                        </a>
                    )}
                </div>
            </div>

            <style jsx>{`
                .about-us-section {
                    position: relative;
                    width: 100%;
                    max-width: 100vw;
                    height: 737px;
                    color: #fff;
                    overflow: hidden;

                    @media (max-width: 767px) {
                        overflow: unset;
                        height: 887px;
                        padding-bottom: 150px;
                    }
                }

                .about-us-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    height: 100%;
                    background-size: cover;
                    margin-right: 100px;

                    @media (max-width: 767px) {
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
                    min-height: 443px;
                    width: 50vw;
                    padding: 2rem;
                    color: #fff;
                    text-align: right;
                    background-color: rgba(14, 70, 50, 0.95);
                    padding: 82px 192px 82px 82px;
                    z-index: 2;

                    @media (max-width: 767px) {
                        margin-bottom: -200px;
                        margin-right: 0;
                        width: 95vw;
                        padding: 50px 30px;
                        height: 440px;
                    }
                }

                .about-us-text h2 {
                    margin-bottom: 1.25rem;

                }

                .rich-text-content p {
                    font-family: 'Calibri', sans-serif;
                    margin-bottom: 1.25rem;

                }

                .learn-more-button {
                    display: inline-block;
                    padding: 18px 30px;
                    background-color: #fff;
                    color: #9E2E3A;
                    border-radius: 8px;
                    text-decoration: none;
                    margin-top: 1rem;
                    font-weight: bold;
                }
            `}</style>
        </section>
    );
};

export default AboutUsBlockInverted;