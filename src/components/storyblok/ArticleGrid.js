import React from 'react';
import { storyblokEditable, StoryblokComponent } from '@storyblok/react';
import { ContentContainer } from '@/src/components';

const ArticleGrid = ({ blok }) => {
    const { columns = 3, articles, content_above_grid, content_below_grid } = blok;

    return (
        <div {...storyblokEditable(blok)}>
            {/* Full-width heading block */}
            <div className="heading-block">
                {/* Render content above the grid if it exists */}
                {content_above_grid &&
                    content_above_grid.map(blok => <StoryblokComponent blok={blok} key={blok._uid} />)}
            </div>

            <ContentContainer>
                <div
                    className="article-grid"
                    style={{
                        display: 'grid',
                        gap: '50px', // Set column gap to 50px
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    }}>
                    {articles.map(article => (
                        <StoryblokComponent blok={article} key={article._uid} />
                    ))}
                </div>

                {/* Render content below the grid if it exists */}
                {content_below_grid &&
                    content_below_grid.map(blok => <StoryblokComponent blok={blok} key={blok._uid} />)}
            </ContentContainer>

            <style jsx>{`
                .heading-block {
                    width: 100vw; // Full viewport width
                    margin-left: calc(50% - 50vw); // Center-align to remove padding
                    margin-bottom: 90px;
                }

                .article-grid {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default ArticleGrid;
