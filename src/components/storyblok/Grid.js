import { storyblokEditable, StoryblokComponent } from '@storyblok/react';
import { ContentContainer } from '@/src/components';

const Grid = ({ blok }) => {
    // Extract top margin from Storyblok field or set a default
    const topMargin = blok.topMargin || 0;

    // Background Image Support (ensuring /m/ is appended)
    const backgroundImageUrl = blok.backgroundImage?.filename ? `${blok.backgroundImage.filename}/m/` : '';

    const backgroundSize = blok.backgroundSize || 'cover';
    const backgroundPosition = blok.backgroundPosition || 'center';
    const backgroundRepeat = blok.backgroundRepeat || 'no-repeat';

    // Define the grid content
    const gridContent = (
        <div
            className={`flex w-full flex-col`}
            style={{
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
                backgroundSize: backgroundSize,
                backgroundPosition: backgroundPosition,
                backgroundRepeat: backgroundRepeat,
            }}
            {...storyblokEditable(blok)}>
            {blok.columns.map(nestedBlok => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
        </div>
    );

    // Conditionally wrap in ContentContainer
    const content = blok.wrap_in_content_container ? <ContentContainer>{gridContent}</ContentContainer> : gridContent;

    // Apply the top margin
    return <div style={{ marginTop: `${topMargin}px` }}>{content}</div>;
};

export default Grid;
