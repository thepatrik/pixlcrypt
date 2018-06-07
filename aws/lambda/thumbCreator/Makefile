.DEFAULT_GOAL := install

.PHONY: install
install:
	sudo pip install pillow
	sudo pip install boto3
	sudo pip install psycopg2
	pip install -U python-dotenv

.PHONY: test
test:
	python awslambda_test.py
