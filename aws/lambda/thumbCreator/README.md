# thumbCreator

## Create lambda deployment package

In order to create a deployment package for AWS lambda we need to go through a couple of manual steps. If docker is not installed, start by doing that.

    docker run --rm -it -v "$PWD:/code" lambci/lambda:build-python2.7 sh
	cd /code
	virtualenv env
	source env/bin/activate
	pip install pillow
	cp -R env/lib/python2.7/site-packages/PIL ./
	zip -r dist.zip thumbs.py PIL
	aws configure
	aws s3 cp dist.zip s3://pixlcrypt-lambdas/thumbCreator/dist.zip
