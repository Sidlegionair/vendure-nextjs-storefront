import React from 'react';
import { storyblokEditable, renderRichText } from '@storyblok/react';
import sanitizeHtml from 'sanitize-html';

const MosaicBlock = ({ blok }) => {
    const htmlContent = renderRichText(blok.description || '');
    const sanitizedContent = sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'button']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height', 'class', 'srcset'],
            button: ['href', 'target'],
        },
    });

    return (
        <section className="mosaic">
            <div className="mosaic__container">
                <div className="mosaic__text" style={{ backgroundColor: blok.backgroundColor || '#355047' }}>
                    <h2 className="mosaic__title">{blok.title || 'Our Story'}</h2>
                    <div className="mosaic__description" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                    {blok.buttonLink && (
                        <a
                            className="mosaic__button"
                            href={blok.buttonLink.url.cached_url}
                            style={{
                                color: blok.backgroundColor || '#355047', // Matches text color to background color
                                backgroundColor: '#FFFFFF', // Keeps the background white
                            }}
                        >
                            {blok.buttonText || 'Read More'} →
                        </a>
                    )}
                </div>

                <div className="mosaic__gallery">
                    {blok.image && Array.isArray(blok.image) && blok.image.map((img, index) => (
                        img && img.filename ? (
                            <div
                                key={index}
                                className={`mosaic__gallery-item item-${index + 1}`}
                                style={{
                                    backgroundImage: `url(${img.filename})`,
                                }}
                            ></div>
                        ) : null
                    ))}
                </div>
            </div>

            <style jsx>{`
                .mosaic {
                    position: relative;
                    width: 100%;
                    max-width: 100vw;
                    height: 785.12px;
                    color: #fff;
                    overflow-x: hidden;
                    text-align: left;
                }

                .mosaic__container {
                    height: 100%;
                    display: flex;
                    position: relative;
                    flex-direction: row;
                    align-items: stretch;
                    flex-wrap: wrap;
                    width: 100%;
                    box-sizing: border-box;
                }

                .mosaic__text {
                    opacity: 0.95;

                    position: absolute; /* Overlay text over gallery */
                    z-index: 10; /* Bring text above gallery */
                    top: 50%; /* Center vertically */
                    //left: 5%;
                    transform: translateY(-50%);
                    width: 50vw;
                    min-width: 280px;
                    padding: 100px 90px 100px 90px;
                    color: #FFFFFF;
                    background-color: rgba(53, 80, 71, 0.85); /* Semi-transparent background for readability */
                }

                .mosaic__title {
                    font-size: 65px;
                    font-weight: 600;
                    line-height: 1.2;
                    margin-bottom: 1.25rem;
                }

                .mosaic__description {
                    margin-bottom: 50px;
                }

                .mosaic__button {
                    display: inline-block;
                    padding: 18px 30px;
                    background-color: #FFFFFF;
                    color: #355047;
                    border-radius: 8px;
                    text-decoration: none;
                    margin-top: 1rem;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 20px;
                }

                .mosaic__gallery {
                    position: relative;
                    left: calc(50vw - 196px);
                    display: grid;
                    gap: 10px;
                    margin-right: 196px;
                    width: 50vw;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, auto);
                    grid-template-areas:
                        "item1 item2 item3"
                        "item5 item5 item4"
                        "item6 item6 item4";
                    //margin: 0 auto;
                    z-index: 1; /* Ensure gallery is behind text */
                }

                .mosaic__gallery-item {
                    background-size: cover;
                    background-position: center;
                    height: 100%;
                    width: 100%;
                }

                .item-1 {
                    grid-area: item1;
                }

                .item-2 {
                    grid-area: item2;
                }

                .item-3 {
                    grid-area: item3;
                }

                .item-4 {
                    grid-area: item4;
                }

                .item-5 {
                    grid-area: item5;
                }

                .item-6 {
                    grid-area: item6;
                }

                @media (max-width: 1200px) {
                    .mosaic__gallery {
                        grid-template-columns: 1fr 1fr;
                        grid-template-areas:
                            "item1 item2"
                            "item3 item4"
                            "item5 item6";
                    }

                    .mosaic__text {
                        width: 70vw;
                        left: 10%;
                    }
                }

                @media (max-width: 768px) {
                    .mosaic__text {
                        position: relative;
                        width: 100%;
                        padding: 2rem;
                        top: auto;
                        left: auto;
                        transform: none;
                    }

                    .mosaic__gallery {
                        width: 100%;
                        left: 0;
                        grid-template-columns: 1fr;
                        grid-template-areas:
                            "item1"
                            "item2"
                            "item3"
                            "item4"
                            "item5"
                            "item6";
                    }

                    .mosaic__gallery-item {
                        height: 250px;
                    }
                }
            `}</style>
        </section>
    );
};

export default MosaicBlock;
