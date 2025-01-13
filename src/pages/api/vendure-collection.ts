// // pages/api/vendure-collection.ts
//
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { vendureClient } from '@/src/graphql/vendureClient';
// import { GetCollectionProductsQuery, GetCollectionProductsQueryVariables, Zeus } from '@/src/graphql/generated';
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'POST') {
//         res.setHeader('Allow', ['POST']);
//         return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//     }
//
//     try {
//         const { collectionSlug, productCount } = req.body as {
//             collectionSlug: string;
//             productCount?: number;
//         };
//
//         if (!collectionSlug) {
//             return res.status(400).json({ message: 'collectionSlug is required.' });
//         }
//
//         // Execute the Zeus-generated query
//         const data: GetCollectionProductsQuery = await vendureClient.Query<GetCollectionProductsQuery, GetCollectionProductsQueryVariables>(
//             GetCollectionProductsDocument,
//             {
//                 slug: collectionSlug,
//                 take: productCount || 10,
//             }
//         );
//
//         if (!data.collection) {
//             return res.status(404).json({ message: 'Collection not found.' });
//         }
//
//         return res.status(200).json(data.collection);
//     } catch (error: any) {
//         console.error('Vendure API Error:', error);
//         return res.status(500).json({ message: 'Vendure API request failed.', error: error.message });
//     }
// }
