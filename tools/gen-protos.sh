#!/bin/bash

export SRC_DIR=src/plugins/optimize/plugins/cqsim/api/grpc
export TAR_DIR=src/plugins/optimize/plugins/cqsim/api/grpc

# generate ts files
npx protoc --proto_path $SRC_DIR --ts_out $TAR_DIR $SRC_DIR/*.proto

# format js/ts files
npx prettier --write $TAR_DIR/**/*.ts
