import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';

const PageHeading = ({ blok }) => {
    // Render and sanitize the rich text content
    const htmlContent = renderRichText(blok.content);
    const sanitizedContent = sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags,
        allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
    });

    // Optional background image URL from the Storyblok content object
    const backgroundImageUrl = blok.backgroundImage.filename || '/images/bg/collectionheaderbg.jpeg';
    const enableNegativeMargin = blok.enableNegativeMargin ?? true; // Default to true if the field is undefined

    return (
        <div
            className="page-heading"
            {...storyblokEditable(blok)}
        >
            <div className="rich-text-editor" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

            <style jsx>{`
                .page-heading {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 421px;
                    width: 100%;
                    color: black;
                    text-align: center;
                    overflow: hidden;
                    z-index: 1;
                }

                /* Background image overlay */
                .page-heading::before {
                    background-size: cover;
                    background-position: center center;
                    background-image: url("${backgroundImageUrl}");
                    content: ' ';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.3;
                    z-index: 0; /* Set the overlay behind the content */
                }

                .rich-text-editor {
                    ${enableNegativeMargin ? 'margin-top: -150px;' : ''}
                    z-index: 1;
                    max-width: 100vw;

                    h1 {
                        font-size: 48px;
                        font-weight: 600;
                        line-height: 54px;
                        text-align: left;
                    }

                    h2 {
                        font-size: 38px;
                        font-weight: 600;
                        line-height: 42px;
                        text-align: left;
                    }

                    h3 {
                        font-size: 32px;
                        font-weight: 600;
                        line-height: 36px;
                        text-align: left;
                    }

                    h4 {
                        font-size: 28px;
                        font-weight: 600;
                        line-height: 32px;
                        text-align: left;
                    }

                    h5 {
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 28px;
                        text-align: left;
                    }

                    h6 {
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 24px;
                        text-align: left;
                    }

                    p {
                        font-family: 'Calibri', sans-serif;
                        color: rgba(77, 77, 77, 1);
                        font-size: 20px;
                        font-weight: 400;
                        line-height: 26px;
                        margin-bottom: 1.5rem;
                        text-align: left;
                    }

                    ul,
                    ol {
                        font-size: 20px;
                        line-height: 26px;
                        padding-left: 2rem;
                        margin-bottom: 1.5rem;
                    }

                    ul li,
                    ol li {
                        margin-bottom: 0.5rem;
                    }

                    blockquote {
                        font-style: italic;
                        font-size: 22px;
                        line-height: 30px;
                        border-left: 4px solid #ccc;
                        padding-left: 1rem;
                        color: rgba(77, 77, 77, 1);
                        margin-bottom: 1.5rem;
                    }

                    img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 1rem auto;
                        border-radius: 4px;
                    }

                    a {
                        color: #007bff;
                        text-decoration: underline;
                    }

                    code {
                        font-family: 'Courier New', monospace;
                        font-size: 18px;
                        background-color: #f4f4f4;
                        padding: 0.2rem 0.4rem;
                        border-radius: 3px;
                    }

                    hr {
                        border: none;
                        border-top: 1px solid rgba(77, 77, 77, 1);
                        margin: 2rem 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default PageHeading;
