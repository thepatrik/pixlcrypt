# pixlcrypt
[![Build Status](https://travis-ci.org/thepatrik/pixlcrypt.svg?branch=master)](https://travis-ci.org/thepatrik/pixlcrypt)

Storage service for pixels.

## development

### .env

Create a .env file and add environment variables to it

* `NODE_ENV` environment running mode
* `PORT` server port
* `DATABASE_SCHEMA` database schema name
* `DATABASE_URL` database url
* `USE_COMPRESSION` Can be `true` (default) or `false`

### scripts

Install app dependencies

```bash
$ make install
```

Run app with

```bash
$ make start
```

Run linter
```bash
$ make eslint
```

Create AWS lambda distribution
```bash
$ make lambda
```
