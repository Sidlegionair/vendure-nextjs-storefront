import type { NextApiRequest, NextApiResponse } from 'next';
import { create } from 'xmlbuilder2';
import { SSGQuery } from '@/src/graphql/client';
// const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_HOST;
const DOMAIN = process.env.VERCEL_URL || 'https://localhost:3001';

// 1) Query basic product data from the Search API
const GET_PRODUCTS = {
    search: [
        {
            input: {
                take: 100,
                groupByProduct: false,
            },
        },
        {
            items: {
                productId: true,
                slug: true,
                sku: true,
                // Use inline fragments for union-type price
                priceWithTax: {
                    '...on PriceRange': {
                        max: true,
                        min: true,
                    },
                    '...on SinglePrice': {
                        value: true,
                    },
                },                description: true,
                facetValueIds: true,
                productAsset: {
                    id: true,
                    preview: true,
                },
            },
        },
    ],
};

// 2) Query all facets
const GET_ALL_FACETS = {
    facets: [
        {},
        {
            items: {
                id: true,
                name: true,
                code: true,
                values: {
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    ],
};

// 3) Query product by productId to fetch brand, GTIN, etc.
const GET_PRODUCT_BY_ID = (id: number) => ({
    product: [
        { id },
        {
            customFields: {
                brand: true,
                // gtin: true,
                // mpn: true,
                // add more as needed
            },
            // variants, etc. if you want them
        },
    ],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const api = SSGQuery({ languageCode: 'en' });

        // a) Fetch search-based items
        const results = await api(GET_PRODUCTS);
        const items = results.search?.items || [];

        // b) Fetch facets
        const facetResult = await api(GET_ALL_FACETS);
        const facetItems = facetResult?.facets?.items || [];
        const facetValueMap: Record<string, { facetName: string; valueName: string; facetCode: string; valueCode: string }> = {};

        for (const facet of facetItems) {
            for (const val of facet.values) {
                facetValueMap[val.id] = {
                    facetName: facet.name,
                    valueName: val.name,
                    facetCode: facet.code,
                    valueCode: val.code,
                };
            }
        }

        // c) Build array of product details from step (a)
        const enrichedItems = [];
        for (const item of items) {
            // Merge facet data
            const mappedFacets = item.facetValueIds?.map((id: string) => facetValueMap[id]).filter(Boolean) || [];

            // Query product brand/gtin/etc.
            const productInfo = await api(GET_PRODUCT_BY_ID(item.productId));
            const customFields = productInfo.product?.customFields || {};

            enrichedItems.push({
                ...item,
                mappedFacets,
                customFields, // brand, gtin, mpn, etc.
            });
        }

        // d) Build the XML feed
        const xmlFeed = buildGoogleMerchantXML(enrichedItems);

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xmlFeed);
    } catch (error) {
        console.error('Error generating feed:', error);
        res.status(500).json({ error: 'Failed to generate feed' });
    }
}

function buildGoogleMerchantXML(items: any[]) {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('rss', {
            version: '2.0',
            'xmlns:g': 'http://base.google.com/ns/1.0',
        })
        .ele('channel');

    root.ele('title').txt('My Store Products').up();
    root.ele('link').txt(DOMAIN).up();
    root.ele('description').txt('All products from My Store, including custom fields').up();

    for (const item of items) {
        // unique ID
        const uniqueId = item.sku ? `${item.productId}-${item.sku}` : String(item.productId);
        const linkUrl = `${DOMAIN}/products/${item.slug}`;

        const xmlItem = root.ele('item');
        xmlItem.ele('g:id').txt(uniqueId).up();
        xmlItem.ele('title').txt(item.productName || '').up();
        xmlItem.ele('description').txt(item.description || '').up();
        xmlItem.ele('link').txt(linkUrl).up();

        // image
        if (item.productAsset?.preview) {
            xmlItem.ele('g:image_link').txt(item.productAsset.preview).up();
        }

        // price: check if it's a PriceRange or SinglePrice
        let priceStr = '';
        if (item.price?.__typename === 'PriceRange') {
            priceStr = `${item.price.min} - ${item.price.max}`;
        } else if (item.price?.__typename === 'SinglePrice') {
            priceStr = String(item.price.value);
        }
        // currency is often the channel’s default; you could store it or guess
        xmlItem.ele('g:price').txt(`${priceStr} EUR`).up();

        xmlItem.ele('g:condition').txt('new').up();
        xmlItem.ele('g:availability').txt('in stock').up();

        // customFields from separate product query
        const cf = item.customFields || {};
        if (cf.brand) {
            xmlItem.ele('g:brand').txt(String(cf.brand)).up();
        }
        if (cf.gtin) {
            xmlItem.ele('g:gtin').txt(String(cf.gtin)).up();
        }
        if (cf.mpn) {
            xmlItem.ele('g:mpn').txt(String(cf.mpn)).up();
        }
        // leftover custom fields -> custom_label_0..4 or something similar
        let labelIndex = 0;
        for (const key of Object.keys(cf)) {
            if (['brand', 'gtin', 'mpn'].includes(key)) continue;
            const val = String(cf[key]);
            if (labelIndex < 5) {
                xmlItem.ele(`g:custom_label_${labelIndex}`).txt(`${key}:${val}`).up();
                labelIndex++;
            } else {
                xmlItem.ele(`g:${key}`).txt(val).up();
            }
        }

        // facet data
        (item.mappedFacets || []).forEach((f: any, idx: number) => {
            if (idx < 5) {
                xmlItem.ele(`g:custom_label_${idx}`).txt(`${f.facetName}:${f.valueName}`).up();
            } else {
                xmlItem.ele(`g:${f.facetCode}`).txt(f.valueCode).up();
            }
        });

        xmlItem.up();
    }

    return root.end({ prettyPrint: true });
}
