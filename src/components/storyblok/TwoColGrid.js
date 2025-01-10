import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { ContentContainer } from "@/src/components";

/**
 * Safely parse a comma-separated string (e.g. "40,60") into two integers [40, 60].
 * Enforces 2 columns (if an incorrect format is supplied, fallback to 50-50).
 */
function parseColumnWidths(widthString) {
    if (typeof widthString !== "string") return [50, 50];

    const parts = widthString.split(",").map((w) => parseInt(w.trim(), 10));
    if (parts.length !== 2 || parts.some((n) => isNaN(n) || n <= 0)) {
        return [50, 50];
    }

    return parts;
}

/**
 * Ensures columnGap is within a reasonable range (0–10%).
 */
function parseColumnGap(gapInput) {
    const gap = parseFloat(gapInput);
    if (isNaN(gap) || gap < 0) return 0;
    if (gap > 10) return 10;
    return gap;
}

const TwoColGrid = ({ blok }) => {
    // Parse and validate all relevant values.
    const [initialWidth1, initialWidth2] = parseColumnWidths(blok.columnWidths);
    let columnGap = parseColumnGap(blok.columnGap);
    const topMargin = typeof blok.topMargin === "number" ? blok.topMargin : 0;

    // Scale down widths if sum(width1 + width2 + gap) exceeds 100.
    // This preserves the percentage-based relationship of the two columns.
    const totalDesired = initialWidth1 + initialWidth2 + columnGap;
    let width1 = initialWidth1;
    let width2 = initialWidth2;

    if (totalDesired > 100) {
        const scaleFactor = (100 - columnGap) / (initialWidth1 + initialWidth2);
        width1 = Math.round(initialWidth1 * scaleFactor);
        width2 = Math.round(initialWidth2 * scaleFactor);
    }

    // Ensure we have at least 2 columns in `blok.columns`. Defaults to empty objects if missing.
    const columns = Array.isArray(blok.columns) ? blok.columns : [];
    const firstColumn = columns[0] || {};
    const secondColumn = columns[1] || {};

    const gridContent = (
        <div
            className="two-col-grid"
            style={{ marginTop: `${topMargin}px` }}
            {...storyblokEditable(blok)}
        >
            <div className="column first-column">
                <StoryblokComponent blok={firstColumn} />
            </div>
            <div className="column second-column">
                <StoryblokComponent blok={secondColumn} />
            </div>

            <style jsx>{`
                .two-col-grid {
                    display: grid;
                    width: 100%;
                    box-sizing: border-box;

                    /* Create two columns, each a given percentage of the available width.
                       Gap is applied strictly as a "column-gap". */
                    grid-template-columns: ${width1}% ${width2}%;
                    column-gap: ${columnGap}%;
                }

                .column {
                    /* Ensures text wraps properly in each column */
                    box-sizing: border-box;
                    white-space: normal;
                    word-wrap: break-word;
                    word-break: break-word;
                    hyphens: auto; /* Optional: helps hyphenate long words in supporting browsers */
                }

                @media (max-width: 768px) {
                    .two-col-grid {
                        /* On mobile, stack columns vertically: 1 column layout with row-gap. */
                        grid-template-columns: 1fr;
                        row-gap: 16px;
                    }
                }
            `}</style>
        </div>
    );

    const content = blok.wrap_in_content_container ? (
        <ContentContainer>{gridContent}</ContentContainer>
    ) : (
        gridContent
    );

    return <>{content}</>;
};

export default TwoColGrid;
