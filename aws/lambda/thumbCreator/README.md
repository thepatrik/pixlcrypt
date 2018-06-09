# thumbCreator

## Create lambda deployment package

In order to create a deployment package for AWS lambda we need to go through a couple of manual steps. If docker is not installed, start by doing that.

Create distribution

    docker run --rm -it -v "$PWD:/code" lambci/lambda:build-python2.7 sh
	cd /code
	./create_dist

Upload to S3

	aws s3 cp dist.$(date +%Y-%m-%d).zip s3://pixlcrypt-lambdas/thumbCreator/dist.$(date +%Y-%m-%d).zip
