import { StoryblokComponent } from '@storyblok/react';
import Link from 'next/link';

const ArticlesOverviewPage = ({ stories }) => {
    return (
        <div className="article-overview">
            <h1>Articles Archive</h1>
            <div className="grid">
                {stories?.length ? (
                    stories.map(story => (
                        <Link href={`/blog/${story.slug}`} key={story.id}>
                            <a>
                                <StoryblokComponent
                                    blok={{
                                        component: 'card',
                                        title: story.name,
                                        image: story.content.featuredImage,
                                        description: story.content.description || '',
                                    }}
                                />
                            </a>
                        </Link>
                    ))
                ) : (
                    <p>No articles available.</p>
                )}
            </div>

            <style jsx>{`
                .article-overview {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default ArticlesOverviewPage;
