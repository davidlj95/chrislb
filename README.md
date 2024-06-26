# Lazaro's website

Portfolio website for Christian Lazaro, fashion designer.

## Managing contents

Check the [content management guide] to edit website's contents

[content management guide]: docs/content-management/index.md

## Developing

### Tooling

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

### Install

First install deps with package manager `pnpm`

```shell
pnpm i
```

### Generated files

Some files required by the app are generated from the data managed by the [CMS] platform and the [image CDN].

[Set the image CDN configuration][image CDN] and run the data generation script before building or serving the app

```shell
pnpm run generate
```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you
change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. It will include prerendering (SSG)

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

### Angular CLI help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

### Git hooks

In order to ensure all code is formatted before committing, you can use Git hooks to automatically run the formatter on
staged files.

To do so, install the hooks by running

```shell
pnpm run git-hooks
```

### Image CDN

[image CDN]: #image-cdn

Image assets of the project are hosted in an image CDN
for [image optimization purposes](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options). [ImageKit.io]
in this case.

See [content management guide] for more information about managing and linking contents in there

#### Image list files

In order to avoid having to manually use the image URLs of the image CDN, a script exists to list existing images in the
CDN. However, that script requires authentication. To provide the authentication, run the create env run script and fill the public and private keys in there.

You can find them
in [the dashboard's developer options API keys section](https://imagekit.io/dashboard/developer/api-keys). Choose the
restricted one, no write access is needed, just read only.

Once this is configured, run the generator script to update the images list querying [ImageKit.io].

[ImageKit.io]: https://imagekit.io

### Content Management System (CMS)

[CMS]: #content-management-system-cms

A headless CMS exists inside the `/admin` path to manage content JSON files. Specifically, [Decap CMS]

For more information about content management, check the [content management guide]

### Locally

To work locally with the CMS, uncomment the `local_backend: true` line in the configuration file.

Then, run the local server (if not, you'll be prompted to use the real backend):

```
pnpm run cms-server
```

> ⚠️👁️ Do not commit the local backend configuration to main branch

[Decap CMS]: https://decapcms.org
