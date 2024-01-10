export type ValueOf<T> = T[keyof T];
// Reverse lookup function
export function getKeyByValue<T extends string | undefined>(
  obj: Record<string, T>,
  value: string,
): keyof typeof obj | undefined {
  return Object.keys(obj).find((key) => obj[key] === value) as
    | keyof typeof obj
    | undefined;
}
export * from './IApiFile';
