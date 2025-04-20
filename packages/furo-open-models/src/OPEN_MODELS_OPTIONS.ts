export interface Options {
  /**
   * UseProtoNames uses proto field name instead of lowerCamelCase name in JSON field names.
   */
  UseProtoNames: boolean;
  /**
   * Replace with your own label formatter, if you want to use translations for the labels.
   * @param key
   */
  labelFormatter: (key: string, ...params: string[]) => string;
  /**
   * EmitUnpopulated specifies whether to emit unpopulated fields. It does not
   * emit unpopulated oneof fields or unpopulated extension fields.
   * The JSON value emitted for unpopulated fields are as follows:
   *  ╔═══════╤════════════════════════════╗
   *  ║ JSON  │ Protobuf field             ║
   *  ╠═══════╪════════════════════════════╣
   *  ║ false │ proto3 boolean fields      ║
   *  ║ 0     │ proto3 numeric fields      ║
   *  ║ ""    │ proto3 string/bytes fields ║
   *  ║ null  │ proto2 scalar fields       ║
   *  ║ null  │ message fields             ║
   *  ║ []    │ list fields                ║
   *  ║ {}    │ map fields                 ║
   *  ╚═══════╧════════════════════════════╝
   */
  EmitUnpopulated: boolean;
  /**
   * EmitDefaultValues specifies whether to emit default-valued primitive fields,
   * empty lists, and empty maps. The fields affected are as follows:
   *  ╔═══════╤════════════════════════════════════════╗
   *  ║ JSON  │ Protobuf field                         ║
   *  ╠═══════╪════════════════════════════════════════╣
   *  ║ false │ non-optional scalar boolean fields     ║
   *  ║ 0     │ non-optional scalar numeric fields     ║
   *  ║ ""    │ non-optional scalar string/byte fields ║
   *  ║ []    │ empty repeated fields                  ║
   *  ║ {}    │ empty map fields                       ║
   *  ╚═══════╧════════════════════════════════════════╝
   *
   * Behaves similarly to EmitUnpopulated, but does not emit "null"-value fields,
   * i.e. presence-sensing fields that are omitted will remain omitted to preserve
   * presence-sensing.
   * EmitUnpopulated takes precedence over EmitDefaultValues since the former generates
   * a strict superset of the latter.
   *
   */
  EmitDefaultValues: boolean;
  /**
   * Use this method to translate the value state messages.
   * @param key - message key
   * @param params - message params
   */
  valueStateMessageFormatter: (key: string, ...params: string[]) => string;
  // todo merge all formatters to one formatter, maybe rename to "translate"
}

export const OPEN_MODELS_OPTIONS: Options = {
  UseProtoNames: true,
  labelFormatter: key => key.replaceAll('.', '_').toUpperCase(),
  EmitDefaultValues: false,
  EmitUnpopulated: false,
  valueStateMessageFormatter: (key, ...params) =>
    `${key}${params.length > 0 ? ` ${params.join(' ')}` : ''}`,
};
