import { ENUM } from "../primitives/ENUM";
import { FieldConstraints } from "../FieldConstraints";
import { FieldNode } from "../FieldNode";
import type { FieldDescriptor } from "../FieldNode";
import { Registry } from "../Registry";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

const primitivesMap: Map<string, string> = new Map([
  ["primitives.BOOLEAN", "boolean"],
  ["primitives.BYTES", "string"],
  ["primitives.DOUBLE", "number"],
  ["primitives.ENUM", "string"],
  ["primitives.FLOAT", "number"],
  ["primitives.INT32", "integer"],
  ["primitives.INT64", "integer"],
  ["primitives.SINT32", "integer"],
  ["primitives.SINT64", "integer"],
  ["primitives.STRING", "string"],
  ["primitives.UINT32", "integer"],
  ["primitives.UINT64", "integer"],
]);

interface FieldNodeSchema {
  $schema: string;
  $id: string;
  [key: string]: unknown;
}

export class SchemaBuilder {
  public static generate(model: FieldNode): JSONSchema7 {
    const schema: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: model.__meta.typeName,
      type: "object",
      description: model.__meta.description,
    };

    schema.properties = SchemaBuilder.getProps(model);

    // required fields
    const rq = SchemaBuilder.getRequiredFields(model.__meta.nodeFields);
    if (rq.length > 0) {
      schema.required = rq;
    }

    return schema;
  }

  private static getProps(model: FieldNode): Record<string, JSONSchema7Definition> {
    return Object.fromEntries(
      model.__meta.nodeFields.map(fieldDescriptor => {
        const field = model.__getFieldNodeByPath(fieldDescriptor.fieldName) as FieldNode;

        if (field.__isPrimitive && field.__meta.typeName !== "primitives.ENUM") {
          const spec = {
            type: primitivesMap.get(field.__meta.typeName!)!,
            description: [fieldDescriptor.description, field.__meta.description].join(""),
            ...SchemaBuilder.getConstraints(fieldDescriptor.constraints),
          };

          return [fieldDescriptor.fieldName, spec];
        }
        // ENUM
        if (field.__meta.typeName === "primitives.ENUM") {
          const eargs = (model.__getFieldNodeByPath("material") as ENUM<unknown>).enumArg;

          return [
            fieldDescriptor.fieldName,
            {
              type: primitivesMap.get(field.__meta.typeName!),
              description: [fieldDescriptor.description, field.__meta.description].join(""),
              enum: Array.from(Object.keys(eargs)),
            },
          ];
        }

        const schema: JSONSchema7 = {
          type: "object",
          description: [fieldDescriptor.description, field.__meta.description].join(""),
        };
        schema.properties = SchemaBuilder.getProps(field);
        // required fields
        const rq = SchemaBuilder.getRequiredFields(model.__meta.nodeFields);
        if (rq.length > 0) {
          schema.required = rq;
        }

        return [fieldDescriptor.fieldName, schema];
      })
    );
  }

  private static getRequiredFields(descriptors: FieldDescriptor[]): string[] {
    const req: string[] = [];
    descriptors.forEach(descriptor => {
      if (descriptor.constraints?.required) {
        req.push(descriptor.fieldName);
      }
    });
    return req;
  }

  private static getConstraints(constraints: FieldConstraints | undefined) {
    if (constraints === undefined) {
      return {};
    }
    const co = { ...constraints };
    delete co.required;
    return co;
  }

  public static createFieldNodeFromSchema(schema: FieldNodeSchema): FieldNode {
    return Registry.createInstanceByTypeName(schema.$id, schema);
  }
}
