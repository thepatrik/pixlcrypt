.DEFAULT_GOAL := db

.PHONY: _drop-public
_drop-public:
	psql -c 'DROP SCHEMA pixlcrypt CASCADE'
	psql -c 'CREATE SCHEMA pixlcrypt'

.PHONY: _drop-private
_drop-private:
	psql -c 'DROP SCHEMA pixlcrypt_private CASCADE'
	psql -c 'CREATE SCHEMA pixlcrypt_private'

.PHONY: _drop-roles
_drop-roles:
	# psql -c 'DROP USER IF EXISTS pixlcrypt_postgraphile'
	# psql -c 'DROP USER IF EXISTS pixlcrypt_anonymous'
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
