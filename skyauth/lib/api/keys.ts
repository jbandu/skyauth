type ApiKeyEntry = {
  key: string;
  airlineCode?: string;
};

let cachedKeys: ApiKeyEntry[] | null = null;

function loadKeys() {
  if (cachedKeys) return cachedKeys;
  const raw = process.env.SKYAUTH_API_KEYS ?? "";
  cachedKeys = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((entry) => {
      const [airlineCode, key] = entry.includes(":") ? entry.split(":") : [undefined, entry];
      return { airlineCode: airlineCode?.toUpperCase(), key };
    });
  return cachedKeys;
}

export function validateApiKey(key?: string | null, airlineCode?: string) {
  if (!key) return false;
  const keys = loadKeys();
  if (!keys.length) {
    console.warn("No SKYAUTH_API_KEYS configured. Rejecting external API request.");
    return false;
  }

  return keys.some((entry) => {
    if (entry.airlineCode && airlineCode) {
      return entry.key === key && entry.airlineCode === airlineCode.toUpperCase();
    }
    return entry.key === key;
  });
}
