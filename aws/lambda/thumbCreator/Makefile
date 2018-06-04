.DEFAULT_GOAL := install

.PHONY: install
install:
	sudo pip install pillow
	sudo pip install boto3

.PHONY: test
test:
	python lambda_test.py
