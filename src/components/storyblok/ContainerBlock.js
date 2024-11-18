import React from 'react';
import { storyblokEditable, StoryblokComponent } from '@storyblok/react';

const ContainerBlock = ({ blok }) => {
    // Ensure content is defined to avoid potential errors
    const content = blok.content || [];

    console.log(content);
    return (
        <section {...storyblokEditable(blok)} className="container-section">
            <div className="container">
                {content.length > 0 ? (
                    content.map((nestedBlok) => (
                        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
                    ))
                ) : (
                    <p>No content available</p> // Fallback message if no content
                )}
            </div>

            <style jsx>{`
                .container-section {
                    position: relative;
                    margin-top: -150px;
                    display: flex;
                    justify-content: center;
                }

                .container {
                    background-color: ${blok.backgroundColor || 'transparent'};
                    padding: 75px;
                    z-index: 10;
                    overflow: hidden;
                    //padding: 20px; /* Optional padding for content spacing */
                    box-shadow: ${blok.shadow ? '0px 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
                }
            `}</style>
        </section>
    );
};

export default ContainerBlock;
