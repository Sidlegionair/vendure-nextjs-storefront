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
import { StoryblokComponent } from '@storyblok/react';
import DOMPurify from 'dompurify';

const RichTextEditor = ({ blok }) => {
    const contentRef = useRef(null);

    // Function to execute scripts found within code blocks
    const executeScripts = (container) => {
        if (!container) return;

        // Select all <code> blocks, regardless of their parent
        const codeBlocks = container.querySelectorAll('code');
        console.log(`Found ${codeBlocks.length} code blocks.`);

        codeBlocks.forEach((block) => {
            const codeContent = block.innerHTML;
            console.log(`Processing code block content: ${codeContent}`);

            const cleanContent = DOMPurify.sanitize(codeContent, {
                ALLOWED_TAGS: ['script'],
                ALLOWED_ATTR: ['src', 'type', 'charset', 'async', 'defer'],
            });

            if (cleanContent.includes('<script')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cleanContent;

                const scripts = tempDiv.querySelectorAll('script');
                scripts.forEach((scriptTag) => {
                    try {
                        const script = document.createElement('script');
                        Array.from(scriptTag.attributes).forEach((attr) => {
                            script.setAttribute(attr.name, attr.value);
                        });
                        script.textContent = scriptTag.textContent;
                        document.body.appendChild(script);
                        document.body.removeChild(script);
                        console.log('Executed a script successfully.');
                    } catch (error) {
                        console.error('Error executing script:', error);
                    }
                });

                // Hide the original code block to prevent displaying as text
                block.parentElement.style.display = 'none';
                console.log('Hid the code block after executing scripts.');
            }
        });
    };

    // Run our executeScripts function when the content updates
    useEffect(() => {
        if (contentRef.current) {
            executeScripts(contentRef.current);
        }
    }, [blok.content]);

    // This effect handles manual scroll adjustments when the URL hash changes.
    useEffect(() => {
        const adjustScroll = () => {
            // Allow the browser to finish its default jump
            setTimeout(() => {
                if (window.location.hash) {
                    const id = window.location.hash.replace('#', '');
                    const element = document.getElementById(id);
                    if (element) {
                        const headerOffset = 220; // Adjust this value to match your fixed header height
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth',
                        });
                    }
                }
            }, 0);
        };

        // Adjust on mount (in case a hash is already in the URL)
        adjustScroll();

        // Listen for future hash changes
        window.addEventListener('hashchange', adjustScroll, false);

        return () => {
            window.removeEventListener('hashchange', adjustScroll, false);
        };
    }, []);

    // Helper to generate an id from heading text if one isn't provided
    const generateIdFromText = (children) => {
        const text = children
            .map((child) => (typeof child === 'string' ? child : ''))
            .join('');
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '');
    };

    const options = {
        nodeResolvers: {
            [NODE_PARAGRAPH]: (children) => <p>{children}</p>,
            [NODE_HEADING]: (children, { level, ...rest }) => {
                const anchorId = rest.id || generateIdFromText(children);
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
            [NODE_PRE]: (children, props) => (
                <pre>
                    <code className={props.node?.attrs?.class || ''}>{children}</code>
                </pre>
            ),
            [NODE_CODE]: (children, props) => (
                <code className={props.node?.attrs?.class || ''}>{children}</code>
            ),
        },
        markResolvers: {
            [MARK_BOLD]: (children) => <strong>{children}</strong>,
            [MARK_ITALIC]: (children) => <em>{children}</em>,
            [MARK_LINK]: (children, { href, target, rel, title }) => {
                console.log(href, target, rel, title);
                if (href.startsWith('#')) {
                    // Simply link to the target; scrolling is handled by our effect above.
                    return (
                        <a href={href} title={title}>
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
                    /* Dynamic font-family and weight applied to the whole container */
                    font-family: ${blok.useAntique
                            ? `"Suisse BP Int'l Antique", sans-serif`
                            : `"Suisse BP Int'l", sans-serif`};
                    font-weight: ${blok.fontWeight || 'inherit'};
                    color: #4d4d4d;
                    line-height: 1.6;
                    ${blok.backgroundColor ? `background-color: ${blok.backgroundColor};` : ''}
                    border: ${blok.border || 'none'};
                    border-radius: ${blok.borderRadius || '0'};
                    box-shadow: ${blok.boxShadow || 'none'};
                    overflow: hidden;
                }

                h1 {
                    margin-bottom: 26px;
                }

                h2 {
                    margin-bottom: 7px;
                }

                h3 {
                    margin-bottom: 5px;
                }

                p {
                    margin-bottom: 1.25rem;
                    color: #4D4D4D;
                }

                a,
                a * {
                    /* If you want anchors to have any specific overrides, add them here */
                    font-size: inherit;
                    text-decoration: underline;
                }

                a:hover {
                    text-decoration: none;
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
            `}</style>
        </div>
    );
};

export default RichTextEditor;
