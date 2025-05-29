import { storyblokEditable, StoryblokComponent } from '@storyblok/react';
import { ContentContainer } from '@/src/components';

const MultiColGrid = ({ blok }) => {
    // Extract the number of columns per row or default to 1
    const columnsPerRow = parseInt(blok.columnsPerRow) || 1;

    // Ensure a valid column count (at least 1 column per row)
    const validColumnsPerRow = Math.max(1, columnsPerRow);

    // Extract top margin and flex alignment from Storyblok fields or set defaults
    const topMargin = blok.topMargin || 0;
    const flexDirection = blok.flexDirection || 'row'; // Default to row
    const justifyContent = blok.justifyContent || 'start'; // Default alignment

    // Background Image Support (ensuring /m/ is appended)
    const backgroundImageUrl = blok.backgroundImage?.filename ? `${blok.backgroundImage.filename}/m/` : '';

    const backgroundSize = blok.backgroundSize || 'cover';
    const backgroundPosition = blok.backgroundPosition || 'center';
    const backgroundRepeat = blok.backgroundRepeat || 'no-repeat';

    // Divide columns into rows
    const rows = [];
    for (let i = 0; i < blok.columns.length; i += validColumnsPerRow) {
        rows.push(blok.columns.slice(i, i + validColumnsPerRow));
    }

    // Define the grid content
    const gridContent = (
        <div
            className="flex flex-col w-full gap-6"
            style={{
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
                backgroundSize: backgroundSize,
                backgroundPosition: backgroundPosition,
                backgroundRepeat: backgroundRepeat,
            }}
            {...storyblokEditable(blok)}>
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex w-full gap-6"
                    style={{
                        flexDirection: flexDirection, // Apply flex direction
                        justifyContent: justifyContent, // Apply justify content
                    }}>
                    {row.map((nestedBlok, colIndex) => (
                        <div
                            key={nestedBlok._uid || colIndex}
                            style={{
                                justifyContent: justifyContent, // Apply justify content
                                flex: `0 0 ${100 / validColumnsPerRow}%`, // Set column width
                                display: 'flex',
                                maxWidth: `${100 / validColumnsPerRow}%`,
                            }}>
                            <StoryblokComponent blok={nestedBlok} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    // Conditionally wrap in ContentContainer
    const content = blok.wrap_in_content_container ? <ContentContainer>{gridContent}</ContentContainer> : gridContent;

    // Apply the top margin
    return <div style={{ marginTop: `${topMargin}px` }}>{content}</div>;
};

export default MultiColGrid;
