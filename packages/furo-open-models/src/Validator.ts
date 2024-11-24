// Full qualified type name
import { FieldConstraints } from './FieldConstraints';

type typeName = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type validationFunc = (node: any) => void;

export const Validators: Map<typeName, validationFunc> = new Map<
  typeName,
  validationFunc
>();

type constraintFunc = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  constraints?: FieldConstraints,
) => string[] | undefined; // return undefined if everything is OK

export const CustomConstraints: Map<typeName, constraintFunc> = new Map<
  typeName,
  constraintFunc
>();
