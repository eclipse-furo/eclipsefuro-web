#!/usr/bin/env bash
WD=`pwd`


# Directory holding all .proto files
SRC_DIR="$WD/proto"

EXT_DIR="$WD/contract/build/extracted-include-protos/main"

# Directory to write generated code (.d.ts files)
OUT_DIR="$WD/protoc-gen-open-models"

protoc \
       -I./proto_dependencies \
       -I$SRC_DIR \
       --open-models_out=$OUT_DIR \
       $(find "${SRC_DIR}" -iname "*.proto")
