import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';
import { ContentContainer, Stack } from '@/src/components';

const RichTextEditor = ({ blok }) => {
    // Render and sanitize the rich text content
    const htmlContent = renderRichText(blok.content);
    const sanitizedContent = sanitizeHtml(htmlContent, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'span'],
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'width', 'height'],
            '*': ['style'], // Allow inline styles for all elements
        },
    });

    // Set text color from Storyblok field or default to a fallback color
    const textColor = blok.textColor || 'rgba(77, 77, 77, 1)';``

    return (
        <Stack w100 className="rich-text-editor">
            <div className="rich-text-editor" {...storyblokEditable(blok)}>
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

                <style jsx>{`
                    /* Headings */
                    .rich-text-editor {
                        div {
                            flex-direction: column;
                            display: flex;
                            gap: 20px;
                        }
                        max-width: 100vw;
                         color: ${textColor}; // Apply the text color dynamically

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

                        /* Paragraphs */

                        p {
                            font-family: 'Calibri', sans-serif;
                            font-size: 20px;
                            font-weight: 400;
                            line-height: 26px;
                            margin-bottom: 1.5rem;
                            text-align: left;
                            
                            @media(max-width: 767px) {
                                font-size: 18px;
                                line-height: 26px;

                            }
                        }

                        /* Lists */

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

                        /* Blockquote */

                        blockquote {
                            font-style: italic;
                            font-size: 22px;
                            line-height: 30px;
                            border-left: 4px solid #ccc;
                            padding-left: 1rem;
                            margin-bottom: 1.5rem;
                        }

                        /* Images */

                        img {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 1rem auto;
                            border-radius: 4px;
                        }

                        /* Links */

                        a {
                            color: #007bff;
                            text-decoration: underline;
                        }

                        /* Code */

                        code {
                            font-family: 'Courier New', monospace;
                            font-size: 18px;
                            background-color: #f4f4f4;
                            padding: 0.2rem 0.4rem;
                            border-radius: 3px;
                        }

                        /* Horizontal Rule */

                        hr {
                            border: none;
                            border-top: 1px solid rgba(77, 77, 77, 1);
                            margin: 2rem 0;
                        }
                    }
                `}</style>
            </div>
        </Stack>
    );
};

export default RichTextEditor;
