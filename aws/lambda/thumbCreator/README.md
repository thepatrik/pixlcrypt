# thumbCreator

AWS lambda generating thumbnails, extracting video frames and downscaling videos.

## Image thumbnails

Here is a list of supported thumbnails and their filenames.

Type | Suffix | Target dimensions (width x height) | Example name
--- | --- | --- | ---
Regular thumb | `_t` | `300x300` | `DSC_0001_t.jpg`
Big thumb | `_b` | `1024x1024` | `DSC_0001_b.jpg`
Original file | `_o` | `NA` | `DSC_0001_o.jpg`
Square thumb | `_s` | `not currently used` | `DSC_0001_s.jpg`
Small thumb | `_m` | `not currently used` | `DSC_0001_m.jpg`

## Video downscaling

Currently supports downscaling from `4K` (`3840x2160`) to `1080p` (`1920x800`).

Type | Suffix | Target dimensions (width x height) | Example name
--- | --- | --- | ---
Big video | `_b` | `~1920x800` | `MOV_0001_b.mp4`

## Dev

### Environment variables

Set these env vars (.env file is supported)

* `PGHOST` Postgres hostname
* `PGDATABASE` Postgres database name
* `PGUSER` Postgres user
* `PGPASSWORD` postgres user password

### Create lambda deployment package

In order to create a deployment package for AWS lambda we need to go through a couple of manual steps. If docker is not installed, start by doing that.

Create distribution

    docker run --rm -it -v "$PWD:/code" lambci/lambda:build-python2.7 sh
	cd /code
	./create_dist

Upload to S3

	aws s3 cp dist.$(date +%Y-%m-%d).zip s3://pixlcrypt-lambdas/thumbCreator/dist.$(date +%Y-%m-%d).zip
