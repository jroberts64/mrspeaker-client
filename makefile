build:
	npm run build

install: build
	aws s3 cp --recursive build s3://jack-roberts.com