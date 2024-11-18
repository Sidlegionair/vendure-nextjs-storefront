import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

const Grid = ({ blok }) => {
  // Determine the number of columns dynamically
  const columnCount = blok.columns.length;
  const gridColsClass = `grid-cols-${columnCount}`;

  return (
      <div
          className={`flex flex-col w-full gap-6 mx-auto ${gridColsClass}`}
          {...storyblokEditable(blok)}
      >
        {blok.columns.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
  );
};

export default Grid;
