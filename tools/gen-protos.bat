@echo off

set SRC_DIR=src/plugins/optimize/plugins/cqsim/api/grpc
set TAR_DIR=src/plugins/optimize/plugins/cqsim/api/grpc

@REM generate ts files
call npx protoc --proto_path %SRC_DIR% --ts_out %TAR_DIR% %SRC_DIR%/*.proto

@REM format ts files
call npx prettier --write %TAR_DIR%/**/*.ts
