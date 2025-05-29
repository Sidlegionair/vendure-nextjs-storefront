import { useState } from 'react';
import { storyblokEditable, StoryblokComponent } from '@storyblok/react';
import { ContentContainer } from '@/src/components';

const ScaleWrapper = ({ blok }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Extract user-defined settings from Storyblok
    const scaleAmount = blok.scaleAmount || 1.1; // Default scale to 1.1x
    const transitionDuration = blok.transitionDuration || 300; // Default 300ms
    const wrapInContainer = blok.wrapInContainer || false;

    // Define the combined style based on hover state
    const combinedStyle = {
        transition: `transform ${transitionDuration}ms ease-in-out`,
        transform: isHovered ? `scale(${scaleAmount})` : 'scale(1)',
    };

    const content = (
        <div
            {...storyblokEditable(blok)}
            className="inline-block"
            style={combinedStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {blok.childComponent &&
                (Array.isArray(blok.childComponent) ? (
                    blok.childComponent.map((child, index) => (
                        <StoryblokComponent blok={child} key={child._uid || index} />
                    ))
                ) : (
                    <StoryblokComponent blok={blok.childComponent} />
                ))}
        </div>
    );

    return wrapInContainer ? <ContentContainer>{content}</ContentContainer> : content;
};

export default ScaleWrapper;
