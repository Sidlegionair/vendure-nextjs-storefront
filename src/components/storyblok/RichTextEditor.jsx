import React, { useEffect, useRef } from 'react';
import {
    render,
    NODE_PARAGRAPH,
    NODE_HEADING,
    NODE_UL,
    NODE_OL,
    NODE_LI,
    NODE_QUOTE,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_LINK,
} from 'storyblok-rich-text-react-renderer';
import Link from 'next/link';
import { StoryblokComponent } from '@storyblok/react';

const RichTextEditor = ({ blok }) => {
    const contentRef = useRef(null);

    // Process <pre><code> blocks for script handling
    const processPreCodeBlocks = (container) => {
        if (!container) return;

        const codeBlocks = container.querySelectorAll('pre code.language-javascript');
        codeBlocks.forEach((block) => {
            const decodedContent = block.textContent;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = decodedContent;

            const inlineScript = tempDiv.querySelector('script:not([src])');
            if (inlineScript) {
                try {
                    eval(inlineScript.textContent); // Execute inline script
                } catch (error) {
                    console.error('Error executing inline script:', error);
                }
            }
            block.parentElement.replaceWith(...tempDiv.childNodes);
        });
    };

    useEffect(() => {
        if (contentRef.current) {
            processPreCodeBlocks(contentRef.current);
        }
    }, [blok.content]);

    // Define rendering options
    const options = {
        nodeResolvers: {
            [NODE_PARAGRAPH]: (children) => <p>{children}</p>,
            [NODE_HEADING]: (children, { level }) =>
                React.createElement(`h${level}`, {}, children),
            [NODE_UL]: (children) => <ul className="list-disc list-inside mb-4 pl-4">{children}</ul>,
            [NODE_OL]: (children) => <ol className="list-decimal list-inside mb-4 pl-4">{children}</ol>,
            [NODE_LI]: (children) => (
                <li className="mb-2 leading-relaxed">
                    <span className="inline-block">{children}</span>
                </li>
            ),
            [NODE_QUOTE]: (children) => <blockquote>{children}</blockquote>,
        },
        markResolvers: {
            [MARK_BOLD]: (children) => <strong>{children}</strong>,
            [MARK_ITALIC]: (children) => <em>{children}</em>,
            [MARK_LINK]: (children, { href, target, rel, title }) => (
                    <a href={href} target={target} rel={rel} title={title}>
                        {children}
                    </a>
            ),
        },
        defaultBlokResolver: (name, props) => {
            const blok = { ...props, component: name };
            return <StoryblokComponent blok={blok} key={props._uid} />;
        },
    };

    let renderedContent;

    try {
        renderedContent = render(blok.content, options);
    } catch (error) {
        console.error('Error rendering rich text document:', error);
        renderedContent = <p>Error rendering content.</p>;
    }

    // Apply spacing dynamically from blok
    const dynamicStyles = {
        margin: blok.margin || '0', // Default to 0 if not set
        padding: blok.padding || '0', // Default to 0 if not set
        textAlign: blok.textAlign || 'left', // Allow text alignment customization
    };

    return (
        <div ref={contentRef} className="rich-text-editor" style={dynamicStyles}>
            {renderedContent}
            <style jsx>{`
                .rich-text-editor {
                    color: #333;
                    font-family: 'Calibri', sans-serif;
                    line-height: 1.6;
                    background-color: ${blok.backgroundColor || '#fff'}; /* Allow background color customization */
                    border: ${blok.border || 'none'}; /* Optional border */
                    border-radius: ${blok.borderRadius || '0'}; /* Optional border radius */
                    box-shadow: ${blok.boxShadow || 'none'}; /* Optional box shadow */
                    overflow: hidden;
                }

                .rich-text-editor h1,
                .rich-text-editor h2,
                .rich-text-editor h3 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #111;
                    margin-bottom: 1rem;
                }

                .rich-text-editor p {
                    font-family: 'Calibri';
                    font-size: 18px;
                    line-height: 1.8;
                    color: #555;
                    margin-bottom: 1.25rem;
                }

                .rich-text-editor a {
                    color: #9E2E3A;
                    font-weight: bold;
                    text-decoration: none;
                }

                .rich-text-editor a:hover {
                    text-decoration: underline;
                }

                .rich-text-editor blockquote {
                    font-style: italic;
                    margin-left: 1em;
                    border-left: 4px solid #ddd;
                    padding-left: 1em;
                    color: #555;
                }
                
                .rich-text-editor img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
