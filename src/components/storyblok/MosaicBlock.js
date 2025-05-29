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

    const getButtonLink = link => {
        if (!link) return '#'; // Default fallback
        if (link.linktype === 'url') return link.url; // External URL
        if (link.linktype === 'story') return `/${link.cached_url || ''}`; // Internal Storyblok story
        return '#'; // Fallback for unknown types
    };

    console.log('LINK:');

    return (
        <section className="mosaic" {...storyblokEditable(blok)}>
            <div className="mosaic__text" style={{ backgroundColor: blok.backgroundColor || '#355047' }}>
                <h1 className="mosaic__title">{blok.title || 'Our Story'}</h1>
                <div className="mosaic__description" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                {blok.buttonLink && blok.buttonLink.url !== '' && (
                    <a
                        className="mosaic__button"
                        href={getButtonLink(blok.buttonLink)}
                        style={{
                            fontWeight: 'bold',
                            color: blok.backgroundColor || '#355047',
                            backgroundColor: '#FFFFFF',
                        }}
                        target={blok.buttonLink.target || '_self'}
                        rel={blok.buttonLink.target === '_blank' ? 'noopener noreferrer' : undefined}>
                        {blok.buttonText || 'Read More'} →
                    </a>
                )}
            </div>

            <div className="mosaic__container">
                <div className="mosaic__gallery">
                    {blok.image &&
                        Array.isArray(blok.image) &&
                        blok.image.map((img, index) =>
                            img && img.filename ? (
                                <div
                                    key={index}
                                    className={`mosaic__gallery-item item-${index + 1}`}
                                    style={{ backgroundImage: `url(${img.filename})` }}></div>
                            ) : null,
                        )}
                </div>
            </div>

            <style jsx>{`
                .mosaic {
                    position: relative;
                    width: 100%;
                    color: #fff;
                    text-align: left;

                    @media (min-width: 767px) {
                        height: 785.12px;
                    }
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
                    position: absolute;
                    z-index: 10;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50vw;
                    min-width: 280px;
                    padding: 100px 90px 100px 90px;
                    color: #ffffff;
                    background-color: rgba(53, 80, 71, 0.85);
                }

                .mosaic__title {
                    margin-bottom: 1.25rem;
                }

                .mosaic__description {
                    margin-bottom: 50px;
                }

                .mosaic__button {
                    display: inline-block;
                    padding: 18px 30px;
                    background-color: #ffffff;
                    color: #355047;
                    border-radius: 8px;
                    text-decoration: none;
                    margin-top: 1rem;
                }

                .mosaic__gallery {
                    position: relative;
                    left: calc(50vw - 196px);
                    display: grid;
                    gap: 10px;
                    width: 50vw;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, auto);
                    grid-template-areas:
                        'item1 item2 item3'
                        'item5 item5 item4'
                        'item6 item6 item4';
                    z-index: 1;
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

                @media (max-width: 767px) {
                    .mosaic {
                        overflow-y: visible !important;
                        height: 100% !important;
                        //padding-bottom: 200px;
                    }

                    .mosaic__text {
                        top: unset;
                        transform: unset;
                        width: calc(100vw - 30px);
                        padding: 30px;
                        position: relative;
                    }

                    .mosaic__gallery {
                        left: unset;
                        width: 100%;
                        padding: 30px;
                        height: 317px;
                    }

                    .mosaic__container {
                        margin-top: -80px;
                    }

                    .item-1 {
                        max-height: 120px;
                    }

                    .item-2 {
                        max-height: 120px;
                    }

                    .item-3 {
                        max-height: 120px;
                    }

                    .item-4 {
                        max-height: 240px;
                    }

                    .item-5 {
                        max-height: 120px;
                    }

                    .item-6 {
                        max-height: 120px;
                    }
                }
            `}</style>
        </section>
    );
};

export default MosaicBlock;
