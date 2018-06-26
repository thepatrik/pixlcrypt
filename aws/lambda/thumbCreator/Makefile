.DEFAULT_GOAL := install
UNAME_S := $(shell uname -s)

.PHONY: install
install:
ifeq ($(UNAME_S),Darwin)
	brew install ffmpeg
endif
	sudo pip install boto3
	sudo pip install pillow
	sudo pip install psycopg2
	pip install -U python-dotenv

.PHONY: test
test:
	python awslambda_test.py
