import { optimizeImage } from '@/src/util/optimizeImage';
import styled from '@emotion/styled';
import { ImgHTMLAttributes, forwardRef } from 'react';

type ImageType = ImgHTMLAttributes<HTMLImageElement>;

export const ProductImage = forwardRef<HTMLImageElement, ImageType>((props, ref) => {
    const { src, ...rest } = props;
    const better_src = src ? optimizeImage({ size: 'tile', src }) : undefined; // Ensure `src` is defined before optimizing
    return <StyledProductImage {...rest} src={better_src} ref={ref} />;
});

const StyledProductImage = styled.img`
    display: block; /* Ensure the image does not have inline spacing */
    max-height: 100%; /* Restrict the image height to the container */
    max-width: 100%; /* Restrict the image width to the container */
    object-fit: contain; /* Maintain aspect ratio and avoid cropping */
    object-position: center; /* Center the image within the container */
    border-radius: ${({ theme }) => theme?.borderRadius || '4px'}; /* Add a fallback radius */
    box-sizing: border-box; /* Include padding and border in size calculation */
    margin: 0 auto; /* Center image horizontally if needed */

    @media (max-width: ${({ theme }) => theme.breakpoints.md || '768px'}) {
        //max-height: 300px; /* Adjust height for smaller screens */
        max-width: 100%; /* Ensure width adapts on smaller screens */
    }
`;
