import React, { useState, useEffect } from 'react';
import { ContentContainer } from '@/src/components';

const ProfileGrid = ({ blok }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered || activeIndex !== null) return;

        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % blok.profiles.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [blok.profiles.length, isHovered, activeIndex]);

    const handleProfileSelect = index => {
        setActiveIndex(index);
    };

    const handleMouseEnter = index => {
        setIsHovered(true);
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setActiveIndex(null);
    };

    return (
        <ContentContainer className="profile-grid-wrapper" onMouseLeave={handleMouseLeave}>
            <div className="profile-dots">
                {blok.profiles.map((profile, index) => (
                    <button
                        key={profile._uid}
                        onClick={() => handleProfileSelect(index)}
                        className={`profile-dot ${index === activeIndex ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${profile.image.filename + '/m/'})`,
                        }}
                    />
                ))}
            </div>
            <div className="profile-carousel">
                <div className="carousel-container">
                    {blok.profiles.map((profile, index) => (
                        <div
                            key={profile._uid}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onClick={() => handleProfileSelect(index)}
                            className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
                            style={{
                                backgroundImage: `url(${profile.image.filename + '/m/'})`,
                            }}>
                            {index === activeIndex && (
                                <div className="overlay">
                                    <h3 className="profile-name">{profile.name}</h3>
                                    <p className="profile-description">{profile.description}</p>
                                    <p className="full-description">{profile.fullDescription}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Style JSX Block */}
            <style jsx>{`
                .profile-grid-wrapper {
                    width: 100vw;
                    overflow: hidden;
                    padding: 20px;
                }

                .profile-dots {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .profile-dot {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
                    margin: 0 5px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                    opacity: 0.6;
                }

                .profile-dot.active {
                    opacity: 1;
                }

                .profile-carousel {
                    display: grid;
                    width: 100%;
                    gap: 10px;
                }

                .carousel-container {
                    display: grid;
                    gap: 10px;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                    width: 100%;
                }

                .carousel-slide {
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    min-height: 400px;
                    position: relative;
                    transition: transform 0.3s ease;
                    cursor: pointer;
                    z-index: 0;

                    &::before {
                        opacity: 0.4;
                        background: rgba(43, 43, 43, 1);
                        width: 100%;
                        height: 100%;
                        position: relative;
                        content: ' ';
                        display: block;
                        z-index: 1;
                    }
                }

                /* Positioning the last item in a 1x2 layout */
                .carousel-slide:nth-child(5) {
                    grid-column: 3 / span 1;
                    grid-row: 1 / span 2;
                }

                .overlay {
                    background-color: rgba(255, 255, 255, 0.65);
                    color: #000;
                    backdrop-filter: blur(31.5);
                    padding: 20px;
                    text-align: left;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    z-index: 10;
                }

                .profile-name {
                    font-weight: 700;
                    font-size: 20px;
                    color: #2a2a2a;
                }

                .profile-description {
                    font-weight: 300;
                    font-size: ${({ theme }) => theme.typography.fontSize.h6};
                    color: #2a2a2a;
                }
            `}</style>
        </ContentContainer>
    );
};

export default ProfileGrid;
