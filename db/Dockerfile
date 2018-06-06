FROM postgres:10-alpine

COPY ./schema.sql   /docker-entrypoint-initdb.d/10_create_schema.sql
COPY ./test_roles.sql   /docker-entrypoint-initdb.d/20_create_roles.sql
COPY ./test_data.sql   /docker-entrypoint-initdb.d/30_create_data.sql

EXPOSE 5432
