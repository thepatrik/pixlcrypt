# pixlcrypt
[![Build Status](https://travis-ci.org/thepatrik/pixlcrypt.svg?branch=master)](https://travis-ci.org/thepatrik/pixlcrypt)

Storage service for pixels.

## development

### PostgreSQL

Install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

### .env

Create a .env file and add environment variables to it

* `NODE_ENV` environment running mode
* `PORT` server port
* `DATABASE_SCHEMA` database schema name
* `DATABASE_URL` database url
* `DISABLE_QUERY_LOG` Set to `true` to disable query log (default to `false`)
* `USE_COMPRESSION` Can be `true` (default) or `false`

Test/CI variables
* `TEST_USER_USERNAME` Set username to be used during API tests
* `TEST_USER_PASSWORD` Set password to be used during API tests
* `AWS_ACCESS_KEY_ID` AWS access key id
* `AWS_SECRET_ACCESS_KEY` AWS secret access key

### scripts

Install app dependencies

```bash
$ make install
```

Run app with

```bash
$ make start
```

Run tests

```bash
$ make test
```

Run linter

```bash
$ make eslint
```

Generate apidoc - available at [docs/v1](http://localhost:5000/docs/v1)

```bash
$ make apidoc
```

Create AWS lambda distribution

```bash
$ make lambda
```
