import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const Carousel = ({ blok }) => {
    const totalSlides = Math.min(5, blok.slides.length);
    const slideWidthPercent = totalSlides >= 5 ? 25 : totalSlides === 4 ? 30 : 50;

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: totalSlides > 1, // Enable looping if there’s more than 1 slide
            align: 'center',
            skipSnaps: false,
        },
        [Autoplay({ delay: 3000, stopOnInteraction: false })]
    );

    // Ensure loop reinitialization only when needed
    const setupLooping = useCallback(() => {
        if (emblaApi) {
            emblaApi.reInit({ loop: totalSlides > 1 });
        }
    }, [emblaApi, totalSlides]);

    useEffect(() => {
        if (emblaApi) {
            emblaApi.on('init', setupLooping); // Set up loop after initialization
        }
        return () => {
            if (emblaApi) emblaApi.off('init', setupLooping);
        };
    }, [emblaApi, setupLooping]);

    const getSlideLink = (link) => {
        if (!link) return '#'; // Default fallback
        if (link.linktype === 'url') return link.url; // External URL
        if (link.linktype === 'story') return `/${link.cached_url || ''}`; // Internal Storyblok story
        return '#'; // Fallback for unknown types
    };

    return (
        <div className="carouselWrapper" ref={emblaRef}>
            <div className="carouselContainer" style={{ '--slide-size': `${slideWidthPercent}%` }}>
                {blok.slides.map((slide, index) => (
                    <div
                        className="carouselSlide"
                        key={`${slide._uid}-${index}`}
                        style={{
                            backgroundImage: `url(${slide.image.filename + '/m/'})`,
                        }}
                    >
                        <div className="slideOverlay">
                            <div className="slideContent">
                                <h2>{slide.title}</h2>
                                <a
                                    href={getSlideLink(slide.link)}
                                    // target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {slide.ctaText}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .carouselWrapper {
                    overflow: hidden;
                    position: relative;
                    width: 100%;
                    margin: auto;
                }

                .carouselContainer {
                    display: flex;
                    touch-action: pan-y pinch-zoom;
                    margin-left: calc(var(--slide-spacing, 30px) * -1);
                }

                .carouselSlide {
                    overflow: hidden;
                    transform: translate3d(0, 0, 0);
                    flex: 0 0 var(--slide-size);
                    min-width: 0;
                    margin-left: 30px;
                    background-size: cover;
                    background-position: center;
                    height: 60vh;
                    position: relative;
                    @media (max-width: 767px) {
                        min-width: 70vw;
                        height: 35vh;
                        margin-left: 15px;
                    }
                }

                .slideOverlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-end;
                    color: #fff;
                    text-align: center;
                }

                .slideContent {
                    padding: 40px;
                    display: flex;
                    flex-direction: column;

                    @media (max-width: 767px) {
                        padding: 15px;
                        gap: 15px;
                    }
                }

                .slideOverlay h2 {
                    font-size: 35px;
                    font-weight: 600;
                    line-height: 35px;
                    text-align: left;
                    margin: 0;

                    @media (max-width: 767px) {
                        font-size: 24px;
                        line-height: 24px;
                    }
                }

                .slideOverlay a {
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 16px;
                    text-align: left;
                    text-decoration: underline;
                    text-transform: uppercase;
                    margin-top: 8px;
                    color: #fff;
                    transition: color 0.2s;
                    @media (max-width: 767px) {
                        font-size: 14px;
                        line-height: 14px;
                    }
                }

                .slideOverlay a:hover {
                    color: #ddd;
                }
            `}</style>
        </div>
    );
};

export default Carousel;
