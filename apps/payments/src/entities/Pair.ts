export const FiatCurrency = ["BRL"] as const;
export const CryptoCurrency = ["BRZ"] as const;
type FiatCurrency = (typeof FiatCurrency)[number];
type CryptoCurrency = (typeof CryptoCurrency)[number];

export type Pair = `${FiatCurrency[number]}-${CryptoCurrency[number]}`;
