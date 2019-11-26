
install:
	npm run build
	aws s3 cp --acl public-read --recursive build s3://jack-roberts.com