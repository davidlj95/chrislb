# Chrislb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

## Install

To install run

```shell
npm i --legacy-peer-deps
```

There's a package (`@ngaox/seo`) that has Angular version peer dep set to 15. Here it's using 16

## Prebuild

Some files required by the app need to be generated from the data managed by the CMS and the image CDN.

[Set the image CDN configuration](#images-cdn) and run the prebuild script before building or serving the app

```shell
npm run prebuild
```

> If you run `npm run build`, this script will run too because of [npm's pre/post scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Images CDN

Image assets of the project are hosted in an image CDN for [image optimization purposes](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options). [ImageKit.io] in this case.

In order to avoid having to manually use the image URLs of the image CDN, a script exists to list existing images in the CDN. However, that script requires authentication. To provide the authentication, run the `create-env-from-sample` run script and fill the public and private keys in there.

You can find them in [the dashboard's developer options API keys section](https://imagekit.io/dashboard/developer/api-keys). Choose the restricted one, no write access is needed, just read only.

Once this is configured, run the `generate-image-lists` script to update the images list querying [ImageKit.io].

[ImageKit.io]: https://imagekit.io

## Git hooks

In order to ensure all code is formatted before committing, you can use Git hooks to automatically run the formatter on staged files.

To do so, install the hooks by running

```shell
npm run git-hooks
```

## CMS

Contents can be edited easily thanks to a CMS. That CMS is [Decap CMS] (formerly known as Netlify CMS). To access it, just access the `/admin/` path.

Production: https://christianlazaro.es/admin/

Push access to the repo is needed, given the CMS will create pull requests with content changes.

### Locally

To work locally, add uncomment the `local_backend: true` line in the configuration.

Then, run the local server:

```
npm run cms-server
```

> ⚠️ Do not commit the local backend configuration to main branch

[Decap CMS]: https://decapcms.org
