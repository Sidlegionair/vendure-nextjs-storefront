import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

const Page = ({ blok }) => (
    <main className="text-center mt-4" {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlok) => (
          <StoryblokComponent className='' blok={nestedBlok} key={nestedBlok._uid} />
      ))}

      <style jsx>{`
        .text-center {
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

    </main>
);

export default Page;
