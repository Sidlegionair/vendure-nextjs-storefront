import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { ContentContainer } from '@/src/components';

const Grid = ({ blok }) => {
    // Determine the number of columns dynamically
    const columnCount = blok.columns.length;
    const gridColsClass = `grid-cols-${columnCount}`;

    // Extract top margin from Storyblok field or set a default
    const topMargin = blok.topMargin || 0;

    // Define the grid content
    const gridContent = (
        <div
            className={`flex flex-col w-full gap-6 mx-auto ${gridColsClass}`}
            {...storyblokEditable(blok)}
        >
            {blok.columns.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
        </div>
    );

    // Conditionally wrap in ContentContainer
    const content = blok.wrap_in_content_container ? (
        <ContentContainer>{gridContent}</ContentContainer>
    ) : (
        gridContent
    );

    // Apply the top margin
    return (
        <div style={{ marginTop: `${topMargin}px` }}>
            {content}
        </div>
    );
};

export default Grid;
