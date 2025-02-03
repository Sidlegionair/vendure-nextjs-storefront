import React, { useEffect, useRef } from 'react';
import {
    render,
    NODE_PARAGRAPH,
    NODE_HEADING,
    NODE_UL,
    NODE_OL,
    NODE_LI,
    NODE_QUOTE,
    NODE_PRE,
    NODE_CODE,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_LINK,
} from 'storyblok-rich-text-react-renderer';
import Link from 'next/link';
import { StoryblokComponent } from '@storyblok/react';
import DOMPurify from 'dompurify';

const RichTextEditor = ({ blok }) => {
    const contentRef = useRef(null);

    // Function to execute scripts found within code blocks
    const executeScripts = (container) => {
        if (!container) return;

        // Select all <code> blocks, regardless of their parent
        const codeBlocks = container.querySelectorAll('code');
        console.log(`Found ${codeBlocks.length} code blocks.`); // Debugging

        codeBlocks.forEach((block) => {
            const codeContent = block.innerHTML; // Use innerHTML to preserve tags
            console.log(`Processing code block content: ${codeContent}`); // Debugging

            // Use DOMPurify to sanitize and allow only <script> tags with specific attributes
            const cleanContent = DOMPurify.sanitize(codeContent, {
                ALLOWED_TAGS: ['script'],
                ALLOWED_ATTR: ['src', 'type', 'charset', 'async', 'defer'],
            });

            if (cleanContent.includes('<script')) {
                // Create a temporary div to parse the clean HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cleanContent;

                const scripts = tempDiv.querySelectorAll('script');
                scripts.forEach((scriptTag) => {
                    try {
                        const script = document.createElement('script');

                        // Copy all attributes from the original script tag
                        Array.from(scriptTag.attributes).forEach((attr) => {
                            script.setAttribute(attr.name, attr.value);
                        });

                        // Copy the script content (for inline scripts)
                        script.textContent = scriptTag.textContent;

                        // Append the script to the body to execute it
                        document.body.appendChild(script);

                        // Remove the script after execution to clean up
                        document.body.removeChild(script);
                        console.log('Executed a script successfully.'); // Debugging
                    } catch (error) {
                        console.error('Error executing script:', error);
                    }
                });

                // Hide the original code block to prevent displaying as text
                block.parentElement.style.display = 'none';
                console.log('Hid the code block after executing scripts.'); // Debugging
            }
        });
    };

    useEffect(() => {
        if (contentRef.current) {
            executeScripts(contentRef.current);
        }
    }, [blok.content]);

    // Define rendering options with custom resolvers for <pre> and <code> blocks
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
            [NODE_PRE]: (children, props) => {
                // Custom resolver for <pre> blocks
                return (
                    <pre>
                        <code className={props.node?.attrs?.class || ''}>
                            {children}
                        </code>
                    </pre>
                );
            },
            [NODE_CODE]: (children, props) => {
                // Custom resolver for <code> blocks inside other elements like <p>
                return (
                    <code className={props.node?.attrs?.class || ''}>
                        {children}
                    </code>
                );
            },
        },
        markResolvers: {
            [MARK_BOLD]: (children) => <strong>{children}</strong>,
            [MARK_ITALIC]: (children) => <em>{children}</em>,
            [MARK_LINK]: (children, { href, target, rel, title }) => {
                console.log(href, target, rel, title);
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
                    .rich-text-editor {
                        font-family: 'Calibri', sans-serif;
                        color: #4d4d4d;
                        line-height: 1.6;
                        ${blok.backgroundColor ? `background-color: ${blok.backgroundColor};` : ''}
                        border: ${blok.border || 'none'};
                        border-radius: ${blok.borderRadius || '0'};
                        box-shadow: ${blok.boxShadow || 'none'};
                        overflow: hidden;

                        h1,
                        h2,
                        h3 {
                            font-family: 'Suisse BP Int\'l', sans-serif;
                            font-size: 35px;
                            font-weight: 600;
                            line-height: 35px;
                            color: #000;
                        }

                        p {
                            font-family: 'Calibri', sans-serif;
                            font-size: 20px;
                            font-weight: 400;
                            line-height: 26px;
                            margin-bottom: 1.25rem;
                            color: #4d4d4d;
                        }

                        a,
                        a * {
                            font-family: 'Calibri', sans-serif;
                            color: #9E2E3A !important;
                            font-weight: bold;
                            text-decoration: none;
                        }

                        a:hover {
                            text-decoration: underline;
                        }

                        blockquote {
                            font-family: 'Calibri', sans-serif;
                            font-style: italic;
                            margin-left: 1em;
                            border-left: 4px solid #ddd;
                            padding-left: 1em;
                            color: #555;
                        }

                        ul,
                        ol {
                            margin: 1rem 0;
                        }

                        img {
                            max-width: 100%;
                            height: auto;
                            margin: 1rem 0;
                        }
                    }
                `}</style>
        </div>
    );
};

export default RichTextEditor;
