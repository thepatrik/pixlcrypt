.DEFAULT_GOAL := db

.PHONY: _drop-public
_drop-public:
	psql -c 'DROP SCHEMA IF EXISTS pixlcrypt CASCADE'

.PHONY: _drop-private
_drop-private:
	psql -c 'DROP SCHEMA IF EXISTS pixlcrypt_private CASCADE'

.PHONY: _drop-roles
_drop-roles:
	# psql -c 'DROP USER IF EXISTS pixlcrypt_postgraphile'
	# psql -c 'DROP USER IF EXISTS pixlcrypt_user'

.PHONY: drop
drop: _drop-public _drop-private _drop-roles

.PHONY: data
data:
	psql -f ./test_data.sql

.PHONY: recreate-with-data
recreate-with-data: drop db data

.PHONY: schema
schema:
	psql -f ./schema.sql

.PHONY: db
db: schema roles

.PHONY: roles
roles:
	psql -f ./test_roles.sql

.PHONY: docker-build
docker-build:
	docker build -t thepatrik/pixlcrypt-db .

.PHONY: docker-run
docker-run:
	docker run thepatrik/pixlcrypt-db

.PHONY: docker-push
docker-push:
	docker push thepatrik/pixlcrypt-db:latest

.PHONY: docker-tag
docker-tag:
	docker tag thepatrik/pixlcrypt-db:latest thepatrik/pixlcrypt-db:latest
