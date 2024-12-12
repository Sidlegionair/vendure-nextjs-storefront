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
        <section className="mosaic" {...storyblokEditable(blok)}>
            <div className="mosaic__text" style={{ backgroundColor: blok.backgroundColor || '#355047' }}>
                <h2 className="mosaic__title">{blok.title || 'Our Story'}</h2>
                <div className="mosaic__description" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                {blok.buttonLink && (
                    <a
                        className="mosaic__button"
                        href={blok.buttonLink.url.cached_url}
                        style={{
                            color: blok.backgroundColor || '#355047',
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        {blok.buttonText || 'Read More'} →
                    </a>
                )}
            </div>

            <div className="mosaic__container">

                <div className="mosaic__gallery">
                    {blok.image && Array.isArray(blok.image) && blok.image.map((img, index) =>
                        img && img.filename ? (
                            <div
                                key={index}
                                className={`mosaic__gallery-item item-${index + 1}`}
                                style={{ backgroundImage: `url(${img.filename})` }}
                            ></div>
                        ) : null
                    )}
                </div>
            </div>

            <style jsx>{`
                .mosaic {
                    position: relative;
                    width: 100%;
                    //max-width: 100vw;
                    color: #fff;
                    //overflow: hidden;
                    text-align: left;
                    
                    @media(min-width: 767px) {
                        height: 785.12px;
                    }
                }

                .mosaic__container {
                    //overflow: hidden;

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
                    //margin-right: 196px;
                    width: 50vw;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, auto);
                    grid-template-areas:
                        "item1 item2 item3"
                        "item5 item5 item4"
                        "item6 item6 item4";
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

                /* Removed all media queries to keep the same layout at all screen sizes */

                @media (max-width: 767px) {
                    .mosiac {
                        overflow-y: visible !important;
                        height: 100% !important;
                        //max-height: 761pxpx;
                        //height: 1px !important;
                        padding-bottom: 200px;
                    }

                    .mosaic__text {
                        top: unset;
                        transform: unset;
                        width: calc(100vw - 30px);
                        padding: 30px;
                        //margin-right: 30px;
                        position: relative;
                        p {
                            /* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pharetra convallis odio, non pretium nunc. Duis lobortis tellus sed imperdiet cursus. Phasellus tincidunt urna eu ante suscipit, sed tincidunt lacus dapibus. Nulla ultricies elit mi, ut euismod ante suscipit et. Duis in fringilla orci. Nam dapibus odio mi. Donec tellus eros, facilisis a gravida eu, mollis a urna. */
                            
                            font-family: 'Calibri';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 18px;
                            line-height: 26px;
                            /* or 144% */

                            color: #FFFFFF;


                        }
                    }
                    
                    .mosaic__gallery {
                        left: unset;
                        //overflow: visible !important;

                        width: 100%;
                        padding: 30px;
                        height: 317px;
                        margin-right: unset;

                    }
                    
                    .mosaic__container {
                        margin-top: -80px;
                    }

                    .item-1 {
                        grid-area: item1;
                        max-height: 120px;
                    }

                    .item-2 {
                        grid-area: item2;
                        max-height: 120px;
                    }

                    .item-3 {
                        grid-area: item3;
                        max-height: 120px;
                    }

                    .item-4 {
                        grid-area: item4;
                        max-height: 240px;

                    }

                    .item-5 {
                        grid-area: item5;
                        max-height: 120px;
                    }

                    .item-6 {
                        grid-area: item6;
                        max-height: 120px;
                    }
                    

                }
            `}</style>
        </section>
    );
};

export default MosaicBlock;
