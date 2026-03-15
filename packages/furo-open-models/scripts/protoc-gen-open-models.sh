#!/usr/bin/env bash
WD=`pwd`


# Directory holding all .proto files
SRC_DIR="$WD/test/proto"

EXT_DIR="$WD/contract/build/extracted-include-protos/main"

# Directory to write generated code (.d.ts files)
OUT_DIR="$WD/test/protoc-gen-open-models"

protoc \
       -I./test/proto_dependencies \
       -I$SRC_DIR \
       --open-models_out=$OUT_DIR \
       $(find "${SRC_DIR}" -iname "*.proto")
