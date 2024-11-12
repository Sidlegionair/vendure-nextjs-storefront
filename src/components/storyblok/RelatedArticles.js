import React from 'react';
import { StoryblokComponent } from '@storyblok/react';

const RelatedArticles = ({ blok }) => {
    return (
        <div className="related-articles">
            <h2>Related blogs</h2>
            <div className="grid">
                {blok.articles.map((article) => (
                    <StoryblokComponent blok={article} key={article._uid} />
                ))}
            </div>

            <style jsx>{`
                .related-articles {
                    margin-top: 50px;
                }
                
                h2 {
                    //font-family: Suisse BP Int'l;
                    font-size: 38px;
                    font-weight: 600;
                    line-height: 38px;
                    text-align: left;

                }
                
                .grid {
                    margin-top: 50px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default RelatedArticles;
