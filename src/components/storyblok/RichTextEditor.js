import React, { useEffect, useRef } from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import { Stack } from '@/src/components';

// Utility to decode HTML entities
const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

const RichTextEditor = ({ blok }) => {
    const contentRef = useRef(null);

    // Render rich text content as raw HTML
    const rawHtmlContent = renderRichText(blok.content);

    // Function to dynamically load a script
    const loadScript = (src, callback) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.onload = callback;
        document.body.appendChild(script);
    };

    // Function to execute HubSpot forms logic
    const executeHubSpotForm = (scriptContent) => {
        try {
            eval(scriptContent); // Execute the script content
        } catch (error) {
            console.error('Error executing HubSpot form script:', error);
        }
    };

    // Process <pre><code> blocks and load external scripts
    const processPreCodeBlocks = (container) => {
        if (!container) return;

        const codeBlocks = container.querySelectorAll('pre code.language-javascript');
        codeBlocks.forEach((block) => {
            // Decode the content of the <code> block
            const decodedContent = decodeHtmlEntities(block.textContent);

            // Extract the external script URL and inline script
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = decodedContent;

            const externalScript = tempDiv.querySelector('script[src]');
            const inlineScript = tempDiv.querySelector('script:not([src])');

            if (externalScript) {
                const scriptSrc = externalScript.getAttribute('src');
                loadScript(scriptSrc, () => {
                    if (inlineScript) {
                        executeHubSpotForm(inlineScript.textContent);
                    }
                });
            }

            // Optionally replace <pre><code> with executed content
            block.parentElement.replaceWith(...tempDiv.childNodes);
        });
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = rawHtmlContent; // Inject raw HTML
            processPreCodeBlocks(contentRef.current); // Process and execute scripts
        }
    }, [rawHtmlContent]);

    // Set text color and top margin dynamically
    const textColor = blok.textColor || 'rgba(77, 77, 77, 1)';
    const topMargin = blok.topMargin || 0;

    return (
        <Stack
            w100
            className="rich-text-editor"
            style={{ marginTop: `${topMargin}px` }}
        >
            <div
                ref={contentRef}
                {...storyblokEditable(blok)}
                className="rich-text-editor-content"
            ></div>

            <style jsx>{`
                /* Headings */
                .rich-text-editor, .rich-text-editor-content {
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

                        @media (max-width: 768px) {
                            font-size: 30px;
                            line-height: 30px;
                        }
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

                        @media (max-width: 768px) {
                            font-size: 18px;
                            line-height: 30px;
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
                        //margin: 1rem auto;
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

        </Stack>
    );
};

export default RichTextEditor;
