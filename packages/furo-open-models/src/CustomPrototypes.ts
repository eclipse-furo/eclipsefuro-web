// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type str = (d: any) => string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type nr = (d: any) => number;

// Full qualified type name
type typeName = string;

export const ToString: Map<typeName, str> = new Map<typeName, str>();
export const ValueOf: Map<typeName, nr> = new Map<typeName, nr>();
