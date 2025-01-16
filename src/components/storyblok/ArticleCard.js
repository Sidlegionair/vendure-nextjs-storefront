import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

const ArticleCard = ({ blok }) => {
    const { title, image, description, link, first_published_at, tags = [] } = blok;

    console.log(tags);

    return (
        <div className="article-card" {...storyblokEditable(blok)}>
            {image && (
                <div className="image-container">
                    <img src={image.filename + '/m/'} alt={title} />
                    <div className="overlay">
                        <div className="date-tag-container">
                            <div className="date">
                                <span className="calendar-icon">
                                    <svg width="31" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M31 16V28.0556C31 28.9691 30.6371 29.8452 29.9911 30.4911C29.3452 31.1371 28.4691 31.5 27.5556 31.5H3.44444C2.53092 31.5 1.65481 31.1371 1.00885 30.4911C0.362896 29.8452 0 28.9691 0 28.0556V16H31ZM22.3889 0.5C22.8456 0.5 23.2837 0.681448 23.6067 1.00443C23.9297 1.32741 24.1111 1.76546 24.1111 2.22222V3.94444H27.5556C28.4691 3.94444 29.3452 4.30734 29.9911 4.9533C30.6371 5.59926 31 6.47537 31 7.38889V12.5556H0V7.38889C0 6.47537 0.362896 5.59926 1.00885 4.9533C1.65481 4.30734 2.53092 3.94444 3.44444 3.94444H6.88889V2.22222C6.88889 1.76546 7.07034 1.32741 7.39332 1.00443C7.7163 0.681448 8.15435 0.5 8.61111 0.5C9.06787 0.5 9.50593 0.681448 9.82891 1.00443C10.1519 1.32741 10.3333 1.76546 10.3333 2.22222V3.94444H20.6667V2.22222C20.6667 1.76546 20.8481 1.32741 21.1711 1.00443C21.4941 0.681448 21.9321 0.5 22.3889 0.5Z"
                                        fill="black" />
                                    </svg>
                                </span>
                                <span>{first_published_at ? format(new Date(first_published_at), 'MM - dd - yyyy') : 'Date not provided'}</span>
                            </div>
                            {tags.length > 0 && <div className="tag">{tags[0]}</div>}
                        </div>
                    </div>
                </div>
            )}
            <div className="content">
                <h2>{title}</h2>
            </div>
            <div className="button-container">
                {link && (
                    <a className="read-more-button" href={link.url}>
                        <span>Read More</span>
                        <span className="arrow">→</span>
                    </a>
                )}
            </div>

            <style jsx>{`
                .article-card {
                    position: relative;
                    width: 476px;
                    height: 511px;
                    border-radius: 15px;
                    overflow: hidden;
                }

                .article-card:hover {
                    //box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .image-container {
                    width: 100%;
                    height: 330px;
                    overflow: hidden;
                    position: relative;
                    background-color: #ddd;
                    border-radius: 0 0 15px 15px;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .overlay {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.5);
                    height: 74px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 30px;
                }

                .date-tag-container {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .date {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-size: 18px;
                    font-weight: 400;
                    color: #000;
                }

                .tag {
                    background-color: #000;
                    color: #fff;
                    padding: 4px 16px;
                    border-radius: 15.5px;
                    font-size: 16px;
                    font-weight: 400;
                    text-align: center;
                }

                .content {
                    h2 {
                        font-size: 30px;
                        font-weight: 600;
                        line-height: 35px;
                    }
                    width: 431px;
                    padding: 20px 0px;
                    color: #000;
                    text-align: left;
                }

                .button-container {
                    bottom: 16px;
                    width: 100%;
                    text-align: center;
                }

                .read-more-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #9E2E3A;
                    color: #fff;
                    font-size: 20px;
                    font-weight: 600;
                    width: 188px;
                    height: 56px;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: background-color 0.2s ease;
                }

                .read-more-button:hover {
                    background-color: #8a2732;
                }

                .arrow {
                    margin-left: 8px;
                    font-size: 20px;
                }
            `}</style>
        </div>
    );
};

export default ArticleCard;
