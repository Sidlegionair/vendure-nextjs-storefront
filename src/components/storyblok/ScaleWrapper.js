import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { ContentContainer } from '@/src/components';

const ScaleWrapper = ({ blok }) => {
    // Extract user-defined settings from Storyblok
    const scaleAmount = blok.scaleAmount || 1.1; // Default scale to 1.1x
    const transitionDuration = blok.transitionDuration || 300; // Default 300ms
    const wrapInContainer = blok.wrapInContainer || false;

    // Define transition styles
    const wrapperStyle = {
        transition: `transform ${transitionDuration}ms ease-in-out`,
    };

    const hoverStyle = {
        transform: `scale(${scaleAmount})`,
    };

    // Render the component
    const content = (
        <div
            {...storyblokEditable(blok)}
            className="inline-block"
            style={wrapperStyle}
        >
            <div className="hover:scale-110" style={hoverStyle}>
                {blok.childComponent && <StoryblokComponent blok={blok.childComponent} />}
            </div>
        </div>
    );

    return wrapInContainer ? <ContentContainer>{content}</ContentContainer> : content;
};

export default ScaleWrapper;
