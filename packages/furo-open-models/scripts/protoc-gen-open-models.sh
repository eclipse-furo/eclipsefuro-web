#!/usr/bin/env bash
WD=`pwd`


# Directory holding all .proto files
SRC_DIR="$WD/test/proto"

EXT_DIR="$WD/contract/build/extracted-include-protos/main"

# Directory to write generated code (.d.ts files)
OUT_DIR="$WD/test/protoc-gen-open-models"
SCHEMA_DIR="$WD/test/schemas"

protoc \
       -I./test/proto_dependencies \
       -I$SRC_DIR \
       --open-models_out=$OUT_DIR \
       --om-jsonschema_out=$SCHEMA_DIR \
       --om-jsonschema_opt=file_extension=.json \
       --debugfile_out=. \
       --debugfile_opt=/tmp/request.bin \
       $(find "${SRC_DIR}" -iname "*.proto")
