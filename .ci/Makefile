.PHONY: *

# First so that running without command runs a build
build: prebuild
	cd .. && bun run prerender
	cd .. && bun run postbuild

prebuild:
	cd .. && bun run bun:prebuild

install:
	# https://bun.sh/docs/cli/install#production-mode
	bun install --frozen-lockfile

lint:
	bun run lint -- --max-warnings 0

test:
	bun run test -- --browsers=ChromeHeadless --no-watch --no-progress --reporters progress --code-coverage

run-main:
	cd .. && act

reset:
	docker ps -a --format '{{.Names}}' | grep -e '^act-' | xargs docker rm -f

format-check:
	cd .. && bun run bun:format-check-all

lighthouse:
	cd .. && npx --yes @lhci/cli@0.12.x autorun
