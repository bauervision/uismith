// Stable stringify for query keys: sorts object keys
export function stableKey(key: any): string {
  return typeof key === "string" ? key : JSON.stringify(key, replacer);
}

function replacer(_: string, value: any) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        acc[k] = value[k];
        return acc;
      }, {} as Record<string, any>);
  }
  return value;
}
