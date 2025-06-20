import ArticleTeaser from './ArticleTeaser';
import { storyblokEditable } from '@storyblok/react';
const PopularArticles = ({ blok }) => {
    return (
        <>
            <h2 className="text-3xl">{blok.headline}</h2>
            <div
                className="grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-3   lg:px-24 md:px-16"
                {...storyblokEditable(blok)}>
                {blok.articles.map(article => {
                    article.content.slug = article.slug;
                    return <ArticleTeaser article={article.content} key={article.uuid} />;
                })}
            </div>
        </>
    );
};

export default PopularArticles;
