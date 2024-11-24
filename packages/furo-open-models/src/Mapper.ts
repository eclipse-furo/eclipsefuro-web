/**
 * proto names are like display_name, name, _some
 * json names are like displayName, name, Xsome
 * @param input
 */
export const protoNameToJsonName = (input: string): string => {
  let transform = input;
  if (transform.startsWith('_')) {
    transform = `X${transform.slice(1)}`;
  }
  return transform
    .toLowerCase()
    .replace(/([-_][a-z])/g, group =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
};
/**
 * proto names are like display_name, name, _some
 * json names are like displayName, name, Xsome
 * @param obj - something of Transport Type
 */
export const deepProtoNameToJsonName = (obj: unknown): unknown => {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepProtoNameToJsonName);
  }
  if (obj === null) {
    return null;
  }
  const entries = Object.entries(obj);
  const mappedEntries = entries.map(
    ([k, v]) =>
      [`${protoNameToJsonName(k)}`, deepProtoNameToJsonName(v)] as const,
  );
  return Object.fromEntries(mappedEntries);
};
export const jsonNameToProtoName = (input: string) => {
  let transform = input;
  if (transform.startsWith('X')) {
    transform = `_${transform.slice(1)}`;
  }
  return transform.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};
/**
 * proto names are like display_name, name, _some
 * json names are like displayName, name, Xsome
 * @param obj - something of Transport Type
 */
export const deepJsonNameToProtoName = (obj: unknown): unknown => {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepJsonNameToProtoName);
  }
  if (obj === null) {
    return null;
  }
  const entries = Object.entries(obj);
  const mappedEntries = entries.map(
    ([k, v]) =>
      [`${jsonNameToProtoName(k)}`, deepJsonNameToProtoName(v)] as const,
  );
  return Object.fromEntries(mappedEntries);
};
