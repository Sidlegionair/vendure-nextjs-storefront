// // ./src/pages/api/google-merchant-feed.ts
//
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { create } from 'xmlbuilder2';
// import { SSGQuery } from '@/src/graphql/client';
// import { DEFAULT_CHANNEL_SLUG, DEFAULT_LOCALE } from '@/src/lib/consts';
//
// // Define the shape of the search query arguments
// interface SearchArgs {
//     input: {
//         take: number;
//         groupByProduct: boolean;
//     };
// }
//
// // Define the shape of the search query selection set
// interface SearchSelection {
//     items: Array<{
//         productId: string;
//         slug: string;
//         sku: string;
//         priceWithTax: {
//             __typename: 'PriceRange' | 'SinglePrice';
//             max?: number;
//             min?: number;
//             value?: number;
//         };
//         name: string; // Added to match XML builder usage
//         description: string;
//         facetValueIds: string[];
//         productAsset: {
//             id: string;
//             preview: string;
//         };
//     }>;
// }
//
// // Define the GET_PRODUCTS query as a tuple
// const GET_PRODUCTS: { search: [SearchArgs, SearchSelection] } = {
//     search: [
//         {
//             input: {
//                 take: 100,
//                 groupByProduct: false,
//             },
//         },
//         {
//             items: {
//                 productId: true,
//                 slug: true,
//                 sku: true,
//                 name: true, // Added to match XML builder
//                 priceWithTax: {
//                     '__typename': true, // Include __typename for union types
//                     '...on PriceRange': {
//                         max: true,
//                         min: true,
//                     },
//                     '...on SinglePrice': {
//                         value: true,
//                     },
//                 },
//                 description: true,
//                 facetValueIds: true,
//                 productAsset: {
//                     id: true,
//                     preview: true,
//                 },
//             },
//         },
//     ],
// } as const; // Ensures TypeScript treats it as a tuple
//
// // Define the shape of the facets query selection set
// interface FacetSelection {
//     items: Array<{
//         id: string;
//         name: string;
//         code: string;
//         values: Array<{
//             id: string;
//             name: string;
//             code: string;
//         }>;
//     }>;
// }
//
// const GET_ALL_FACETS = {
//     facets: [
//         {},
//         {
//             items: {
//                 id: true,
//                 name: true,
//                 code: true,
//                 values: {
//                     id: true,
//                     name: true,
//                     code: true,
//                 },
//             },
//         },
//     ],
// } as const;
//
// // Define the shape of the product's custom fields
// interface CustomFields {
//     brand?: string;
//     // Add other custom fields as needed
// }
//
// // Define the GET_PRODUCT_BY_ID query as a tuple
// const GET_PRODUCT_BY_ID = (id: number) => ({
//     product: [
//         { id },
//         {
//             customFields: {
//                 brand: true,
//                 // Add other custom fields as needed
//             },
//             // Include other fields if necessary
//         },
//     ] as [ { id: number }, { customFields: CustomFields } ],
// });
//
// // Define DOMAIN correctly
// const DOMAIN = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://localhost:3001';
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         const api = SSGQuery({ locale: DEFAULT_LOCALE, channel: DEFAULT_CHANNEL_SLUG });
//
//         // a) Fetch search-based items
//         const results = await api(GET_PRODUCTS);
//         const items = results.search?.items || [];
//
//         // b) Fetch facets
//         const facetResult = await api(GET_ALL_FACETS);
//         const facetItems = facetResult?.facets?.items || [];
//         const facetValueMap: Record<string, { facetName: string; valueName: string; facetCode: string; valueCode: string }> = {};
//
//         for (const facet of facetItems) {
//             for (const val of facet.values) {
//                 facetValueMap[val.id] = {
//                     facetName: facet.name,
//                     valueName: val.name,
//                     facetCode: facet.code,
//                     valueCode: val.code,
//                 };
//             }
//         }
//
//         // c) Build array of product details from step (a) using Promise.all for concurrency
//         const enrichedItems = await Promise.all(items.map(async (item) => {
//             // Merge facet data
//             const mappedFacets = item.facetValueIds?.map((id: string) => facetValueMap[id]).filter(Boolean) || [];
//
//             // Query product brand/etc.
//             const productInfo = await api(GET_PRODUCT_BY_ID(parseInt(item.productId)));
//             const customFields = productInfo.product?.customFields || {};
//
//             return {
//                 ...item,
//                 mappedFacets,
//                 customFields, // brand, etc.
//             };
//         }));
//
//         // d) Build the XML feed
//         const xmlFeed = buildGoogleMerchantXML(enrichedItems);
//
//         res.setHeader('Content-Type', 'application/xml');
//         res.status(200).send(xmlFeed);
//     } catch (error) {
//         console.error('Error generating feed:', error);
//         res.status(500).json({ error: 'Failed to generate feed' });
//     }
// }
//
// // Function to build the Google Merchant XML feed
// function buildGoogleMerchantXML(items: any[]) {
//     const root = create({ version: '1.0', encoding: 'UTF-8' })
//         .ele('rss', {
//             version: '2.0',
//             'xmlns:g': 'http://base.google.com/ns/1.0',
//         })
//         .ele('channel');
//
//     root.ele('title').txt('My Store Products').up();
//     root.ele('link').txt(DOMAIN).up();
//     root.ele('description').txt('All products from My Store, including custom fields').up();
//
//     for (const item of items) {
//         // Unique ID
//         const uniqueId = item.sku ? `${item.productId}-${item.sku}` : String(item.productId);
//         const linkUrl = `${DOMAIN}/products/${item.slug}`;
//
//         const xmlItem = root.ele('item');
//         xmlItem.ele('g:id').txt(uniqueId).up();
//         xmlItem.ele('title').txt(item.name || '').up(); // Corrected from item.productName to item.name
//         xmlItem.ele('description').txt(item.description || '').up();
//         xmlItem.ele('link').txt(linkUrl).up();
//
//         // Image
//         if (item.productAsset?.preview) {
//             xmlItem.ele('g:image_link').txt(item.productAsset.preview).up();
//         }
//
//         // Price: Check if it's a PriceRange or SinglePrice
//         let priceStr = '';
//         if (item.priceWithTax?.__typename === 'PriceRange') {
//             if (item.priceWithTax.min !== undefined && item.priceWithTax.max !== undefined) {
//                 priceStr = `${item.priceWithTax.min} - ${item.priceWithTax.max}`;
//             }
//         } else if (item.priceWithTax?.__typename === 'SinglePrice') {
//             if (item.priceWithTax.value !== undefined) {
//                 priceStr = String(item.priceWithTax.value);
//             }
//         }
//
//         if (priceStr) {
//             // Assuming EUR as the currency; adjust as needed
//             xmlItem.ele('g:price').txt(`${priceStr} EUR`).up();
//         }
//
//         xmlItem.ele('g:condition').txt('new').up();
//         xmlItem.ele('g:availability').txt('in stock').up();
//
//         // Custom Fields from separate product query
//         const cf = item.customFields || {};
//         if (cf.brand) {
//             xmlItem.ele('g:brand').txt(String(cf.brand)).up();
//         }
//         // Add other custom fields like gtin, mpn as needed
//         // Example:
//         // if (cf.gtin) {
//         //     xmlItem.ele('g:gtin').txt(String(cf.gtin)).up();
//         // }
//         // if (cf.mpn) {
//         //     xmlItem.ele('g:mpn').txt(String(cf.mpn)).up();
//         // }
//
//         // Leftover custom fields -> custom_label_0..4 or similar
//         let labelIndex = 0;
//         for (const key of Object.keys(cf)) {
//             if (['brand'].includes(key)) continue; // Skip already handled fields
//             const val = String(cf[key]);
//             if (labelIndex < 5) {
//                 xmlItem.ele(`g:custom_label_${labelIndex}`).txt(`${key}:${val}`).up();
//                 labelIndex++;
//             } else {
//                 xmlItem.ele(`g:${key}`).txt(val).up();
//             }
//         }
//
//         // Facet Data
//         (item.mappedFacets || []).forEach((f: any, idx: number) => {
//             if (idx < 5) {
//                 xmlItem.ele(`g:custom_label_${idx}`).txt(`${f.facetName}:${f.valueName}`).up();
//             } else {
//                 xmlItem.ele(`g:${f.facetCode}`).txt(f.valueCode).up();
//             }
//         });
//
//         xmlItem.up();
//     }
//
//     return root.end({ prettyPrint: true });
// }
