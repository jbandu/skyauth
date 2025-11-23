export type AirlineBrand = {
  code: string;
  name: string;
  logo?: string;
  primary: string;
  secondary: string;
};

export const AIRLINE_BRANDS: Record<string, AirlineBrand> = {
  copa: {
    code: "CM",
    name: "Copa Airlines",
    primary: "#004C97",
    secondary: "#FFD100",
    logo: "/logos/copa-airlines.svg",
  },
  avelo: {
    code: "XP",
    name: "Avelo Airlines",
    primary: "#FF6B35",
    secondary: "#004E89",
    logo: "/logos/avelo-airlines.svg",
  },
};

export function getBrandByCode(code?: string): AirlineBrand {
  if (!code) return AIRLINE_BRANDS.copa;
  const entry = Object.values(AIRLINE_BRANDS).find(
    (brand) => brand.code.toLowerCase() === code.toLowerCase()
  );
  return entry ?? AIRLINE_BRANDS.copa;
}
