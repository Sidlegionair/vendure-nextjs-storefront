import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { ContentContainer } from '@/src/components';

const TwoColGrid = ({ blok }) => {
    // Extract column widths or set defaults to 50%-50%
    const columnWidths = blok.columnWidths?.split(',').map(width => width.trim()) || ["50", "50"];

    // Validate that there are exactly two widths and they sum to 100
    const validWidths = columnWidths.length === 2 &&
        columnWidths.every(width => parseInt(width) > 0 && parseInt(width) <= 100) &&
        columnWidths.reduce((sum, width) => sum + parseInt(width), 0) === 100;

    // Fallback to 50%-50% if widths are invalid
    const [width1, width2] = validWidths ? columnWidths : ["50", "50"];

    // Extract top margin from Storyblok field or set a default
    const topMargin = blok.topMargin || 0;

    // Extract gap between columns or set a default
    const columnGap = blok.columnGap || 24; // Default gap in pixels (e.g., 24px)

    // Define the grid content
    const gridContent = (
        <div
            className="flex w-full mx-auto"
            style={{ gap: `${columnGap}px` }} // Apply gap
            {...storyblokEditable(blok)}
        >
            <div style={{ flexBasis: `${width1}%` }}>
                <StoryblokComponent blok={blok.columns[0]} />
            </div>
            <div style={{ flexBasis: `${width2}%` }}>
                <StoryblokComponent blok={blok.columns[1]} />
            </div>
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

export default TwoColGrid;
