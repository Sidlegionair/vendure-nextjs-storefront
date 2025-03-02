import 'next-i18next';
import resources from '@/src/@types/resources';

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: {
            // For the common namespace, widen errors.backend
            common: {
                // Keep all other keys from common as-is…
                // and override errors.backend to be a record of string keys:
                errors: {
                    backend: Record<string, string>;
                } & Omit<typeof resources.common.errors, 'backend'>;
            } & Omit<typeof resources.common, 'errors'>;
            // Other namespaces remain unchanged:
            checkout: typeof resources.checkout;
            collections: typeof resources.collections;
            customer: typeof resources.customer;
            homepage: typeof resources.homepage;
            products: typeof resources.products;
        };
    }
}
