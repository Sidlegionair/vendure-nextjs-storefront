// // src/components/molecules/VendureCollectionSlider.tsx
//
// import React from 'react';
// import styled from '@emotion/styled';
// import { HomePageSliders } from '@/src/components/organisms/HomePageSliders';
// import { SbBlokData } from '@storyblok/react';
// // import { useQuery } from '@apollo/client'; // Alternatively, use your preferred data fetching hook
// import { GetCollectionProductsDocument, GetCollectionProductsQuery, GetCollectionProductsQueryVariables } from '@/src/graphql/generated';
//
// interface VendureCollectionSliderProps {
//     blok: SbBlokData & {
//         collectionSlug: string;
//         title?: string;
//         productCount?: number;
//         seeAllLink?: {
//             url: string;
//             linktype: string;
//             cached_url?: string;
//         };
//     };
// }
//
// export const VendureCollectionSlider: React.FC<VendureCollectionSliderProps> = ({ blok }) => {
//     const { collectionSlug, title, productCount, seeAllLink } = blok;
//
//     const { data, loading, error } = useQuery<GetCollectionProductsQuery, GetCollectionProductsQueryVariables>(
//         GetCollectionProductsDocument,
//         {
//             variables: {
//                 slug: collectionSlug,
//                 take: productCount || 10,
//             },
//             fetchPolicy: 'cache-and-network', // Adjust based on your caching strategy
//         }
//     );
//
//     if (loading) return <Loading>Loading...</Loading>;
//     if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
//     if (!data?.collection) return <NoProducts>Collection not found.</NoProducts>;
//     if (data.collection.products.items.length === 0) return <NoProducts>No products found.</NoProducts>;
//
//     const products = data.collection.products.items;
//
//     return (
//         <SliderContainer>
//             {title && <SliderTitle>{title}</SliderTitle>}
//             <HomePageSliders sliders={[{ products }]} seeAllText="See All" seeAllLink={seeAllLink?.url} />
//         </SliderContainer>
//     );
// };
//
// // Styled Components
// const SliderContainer = styled.div`
//     width: 100%;
//     margin-bottom: 4rem;
// `;
//
// const SliderTitle = styled.h2`
//     font-size: 2rem;
//     margin-bottom: 1.5rem;
// `;
//
// const Loading = styled.div`
//     text-align: center;
//     padding: 2rem;
// `;
//
// const ErrorMessage = styled.div`
//     color: red;
//     text-align: center;
//     padding: 2rem;
// `;
//
// const NoProducts = styled.div`
//     text-align: center;
//     padding: 2rem;
// `;
