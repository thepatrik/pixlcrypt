.DEFAULT_GOAL := db

.PHONY: _drop-public
_drop-public:
	psql -c 'DROP SCHEMA pixlcrypt CASCADE'
	psql -c 'CREATE SCHEMA pixlcrypt'
	psql -c 'GRANT ALL ON SCHEMA pixlcrypt TO postgres'
	psql -c 'GRANT ALL ON SCHEMA pixlcrypt TO public'

.PHONY: _drop-private
_drop-private:
	psql -c 'DROP SCHEMA pixlcrypt_private CASCADE'
	psql -c 'CREATE SCHEMA pixlcrypt_private'
	psql -c 'GRANT ALL ON SCHEMA pixlcrypt_private TO postgres'
	psql -c 'GRANT ALL ON SCHEMA pixlcrypt_private TO public'

.PHONY: drop
drop: _drop-public _drop-private

.PHONY: data
data:
	psql -f ./test_data.sql


.PHONY: recreate-with-data
recreate-with-data: drop db data

.PHONY: db
db:
	psql -f ./schema.sql
