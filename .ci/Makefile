.PHONY: *

build:
	npm run prerender

lint:
	npm run lint -- --max-warnings 0

test:
	npm run test -- --browsers=ChromeHeadless --no-watch --no-progress --reporters progress --code-coverage

run-main:
	cd .. && act

reset:
	docker ps -a --format '{{.Names}}' | grep -e '^act-' | xargs docker rm -f

format-check:
	cd .. && npm run format-check-all

lighthouse:
	cd .. && npx --yes @lhci/cli@0.12.x autorun
