import { storyblokEditable, StoryblokComponent } from '@storyblok/react';

const BlogPost = ({ blok, articles }) => {
    console.log('Received blok in BlogPost:', blok);
    console.log(articles);

    if (!blok) {
        return <p>Error: Blog post content is missing.</p>;
    }

    return (
        <div className="text-center" {...storyblokEditable(blok)}>
            {/* Render PageHeading with title as content and featuredImage as backgroundImage */}
            <StoryblokComponent
                blok={{
                    component: 'page-heading',
                    content: blok.title || 'Untitled Post', // map title to content
                    backgroundImage: blok.featuredImage || null, // map featuredImage to backgroundImage
                }}
            />

            {/* Wrap content in ContainerBlock and include RichTextEditor as a nested block */}
            <StoryblokComponent
                blok={{
                    component: 'container-block',
                    backgroundColor: '#fff',

                    content: [
                        {
                            component: 'rich-text-editor',
                            content: blok.content || [], // Pass rich text content here
                            articles: articles,
                        },
                        {
                            component: 'related-articles',
                            articles: articles,
                        },
                        // Other nested blocks can go here as needed
                    ],
                }}
            />

            <style jsx>{`
                .text-center {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
