# thumbCreator

## Create lambda deployment package

In order to create a deployment package for AWS lambda we need to go through a couple of manual steps. If docker is not installed, start by doing that.

Create distribution

    docker run --rm -it -v "$PWD:/code" lambci/lambda:build-python2.7 sh
	cd /code
	virtualenv env
	source env/bin/activate
	pip install pillow psycopg2 python-dotenv
	cp -R env/lib/python2.7/site-packages/PIL ./
	cp -R env/lib/python2.7/site-packages/psycopg2 ./
	cp -R env/lib/python2.7/site-packages/python_dotenv-0.8.2.dist-info ./
	zip -r dist.$(date +%Y-%m-%d).zip awslambda.py pixlcrypt_db.py thumbs.py PIL psycopg2 python_dotenv-0.8.2.dist-info
	exit

Upload to S3

	aws s3 cp dist.$(date +%Y-%m-%d).zip s3://pixlcrypt-lambdas/thumbCreator/dist.$(date +%Y-%m-%d).zip
