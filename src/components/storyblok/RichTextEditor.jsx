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
            [NODE_HEADING]: (children, { level, ...rest }) => {
                const anchorId = rest.id || '';
                return React.createElement(`h${level}`, { id: anchorId }, children);
            },
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
            [MARK_LINK]: (children, { href, target, rel, title }) => {
                if (href.startsWith('#')) {
                    return (
                        <a id={href.substring(1)} href={href} title={title}>
                            {children}
                        </a>
                    );
                }
                return (
                    <a href={href} target={target} rel={rel} title={title}>
                        {children}
                    </a>
                );
            },
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

    const dynamicStyles = {
        margin: blok.margin || '0',
        padding: blok.padding || '0',
        textAlign: blok.textAlign || 'left',
    };

    return (
        <div ref={contentRef} className="rich-text-editor" style={dynamicStyles}>
            {renderedContent}
            <style jsx>{`
                @font-face {
                    font-family: 'Suisse BP Int'l';
                    font-weight: 400 600;
                    font-style: normal;
                }

                @font-face {
                    font-family: 'Calibri';
                    src: local('Calibri');
                    font-weight: 400 700;
                    font-style: normal;
                }

                .rich-text-editor {
                    font-family: 'Calibri', sans-serif;
                    color: #4d4d4d;
                    line-height: 1.6;
                    background-color: ${blok.backgroundColor || '#fff'};
                    border: ${blok.border || 'none'};
                    border-radius: ${blok.borderRadius || '0'};
                    box-shadow: ${blok.boxShadow || 'none'};
                    overflow: hidden;
                }

                .rich-text-editor h1,
                .rich-text-editor h2,
                .rich-text-editor h3 {
                    font-family: 'Suisse BP Int'l', sans-serif;
                    font-size: 35px;
                    font-weight: 600;
                    line-height: 35px;
                    color: #000;
                }

                .rich-text-editor p {
                    font-family: 'Calibri', sans-serif;
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 26px;
                    margin-bottom: 1.25rem;
                    color: #4d4d4d;
                }

                .rich-text-editor a {
                    font-family: 'Calibri', sans-serif;
                    color: #9E2E3A;
                    font-weight: bold;
                    text-decoration: none;
                }

                .rich-text-editor a:hover {
                    text-decoration: underline;
                }

                .rich-text-editor blockquote {
                    font-family: 'Calibri', sans-serif;
                    font-style: italic;
                    margin-left: 1em;
                    border-left: 4px solid #ddd;
                    padding-left: 1em;
                    color: #555;
                }

                .rich-text-editor ul,
                .rich-text-editor ol {
                    margin: 1rem 0;
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
