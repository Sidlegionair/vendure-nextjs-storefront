// import { SSGQuery } from '@/src/graphql/client';
// import { ProductSlugSelector } from '@/src/graphql/selectors';
// import { DEFAULT_CHANNEL, channels } from '@/src/lib/consts';
// import { getAllPossibleWithChannels } from '@/src/lib/getStatic';
//
// export const getStaticPaths = async () => {
//     // Await the dynamic channels paths
//     const allPaths = await getAllPossibleWithChannels();
//     const resp = await Promise.all(
//         allPaths.map(async path => {
//             const channel = channels.find(c => c.slug === path.params.channel)?.channel ?? DEFAULT_CHANNEL;
//             const { products } = await SSGQuery({ channel, locale: path.params.locale })({
//                 products: [{}, { items: ProductSlugSelector }],
//             });
//             return { ...products, ...path.params };
//         }),
//     );
//     const paths = resp.flatMap(data =>
//         data.items.map(item => {
//             return { params: { ...data, slug: item.slug } };
//         }),
//     );
//
//     return { paths, fallback: 'blocking' };
// };

export const getStaticPaths = async () => {
    return {
        paths: [], // Or only pre-build a few key pages
        fallback: 'blocking',
    };
};
