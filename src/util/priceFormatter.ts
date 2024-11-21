import { CurrencyCode } from '@/src/zeus';

/**
 * @param price - price to format
 * @param currencyCode - currency code e.g. USD
 */
export function priceFormatter(price: number, currencyCode: CurrencyCode) {
    const translations: Partial<Record<CurrencyCode, { country: string }>> = {
        [CurrencyCode.USD]: {
            country: 'en-US',
        },
        [CurrencyCode.EUR]: {
            country: 'nl-NL', // Changed for proper Euro formatting in the Netherlands
        },
        [CurrencyCode.PLN]: {
            country: 'pl-PL',
        },
        [CurrencyCode.CZK]: {
            country: 'cs-CZ',
        },
    };

    const c = translations[currencyCode];
    if (!c) {
        const formatterCode = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: 'USD',
        });
        return formatterCode.format(price / 100);
    }

    const formatterCode = new Intl.NumberFormat(c.country, {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: currencyCode,
    });
    return formatterCode.format(price / 100);
}
