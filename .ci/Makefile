.PHONY: *

# First so that running without command runs a build
build: prebuild
	cd .. && pnpm run build

prebuild:
	cd .. && pnpm run generate-all

install:
	# Despite it's enabled by default on CI. This allows to mock CI locally
	# https://pnpm.io/cli/install#--frozen-lockfile
	pnpm install --frozen-lockfile

lint:
	pnpm run lint --max-warnings 0

test:
	pnpm run test --browsers=ChromeHeadless \
		--no-watch --no-progress --reporters progress --code-coverage
