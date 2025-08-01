We should be compatible with the types from https://github.com/bufbuild/protobuf-es

| Protobuf type | ECMAScript type | Notes                                                                           | Default value       |
| ------------- | --------------- | ------------------------------------------------------------------------------- | ------------------- |
| string        | string          | UTF-8                                                                           | `""`                |
| bool          | boolean         |                                                                                 | `false`             |
| bytes         | Uint8Array      |                                                                                 | `new Uint8Array(0)` |
| double        | number          | Double-precision, 64-bit floating point value                                   | `0`                 |
| float         | number          | Single-precision, 32-bit floating point value                                   | `0`                 |
| int32         | number          | 32-bit signed integer with variable length                                      | `0`                 |
| uint32        | number          | 32-bit unsigned integer with variable length                                    | `0`                 |
| int64         | bigint          | 64-bit signed integer with variable length                                      | `0n`                |
| uint64        | bigint          | 64-bit unsigned integer with variable length                                    | `0n`                |
| fixed32       | number          | 32-bit unsigned integer with fixed length (always 4 bytes)                      | `0`                 |
| fixed64       | bigint          | 64-bit unsigned integer with fixed length (always 8 bytes)                      | `0n`                |
| sfixed32      | number          | 32-bit signed integer with fixed length (always 4 bytes)                        | `0`                 |
| sfixed64      | bigint          | 64-bit signed integer with fixed length (always 8 bytes)                        | `0n`                |
| sint32        | number          | 32-bit signed integer with variable length, most efficient for negative numbers | `0`                 |
| sint64        | bigint          | 64-bit signed integer with variable length, most efficient for negative numbers | `0n`                |
