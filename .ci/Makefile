.PHONY: *

# First so that running without command runs a build
build: prebuild
	cd .. && pnpm run build

prebuild:
	cd .. && pnpm run scripts:all

mock-data:
	cd .. && mkdir -p data/generated && echo '{}' > data/generated/misc-images.json

install:
	# Despite it's enabled by default on CI. This allows to mock CI locally
	# https://pnpm.io/cli/install#--frozen-lockfile
	pnpm install --frozen-lockfile

unit-test:
	pnpm run test:app:unit --browsers=ChromeHeadless \
		--no-watch --no-progress --reporters progress --code-coverage
