# m2i

[![Build Status][actions-img]][actions-url]
[![Coverage Status][codecov-img]][codecov-url]
[![License][license-img]][license-url]
[![NPM Downloads][downloads-img]][downloads-url]
[![NPM Version][version-img]][version-url]
[![Dependency Status][dependency-img]][dependency-url]
[![devDependency Status][devdependency-img]][devdependency-url]
[![Code Style][style-img]][style-url]

> A minimalist markdown to image converter, built with [puppeteer](https://pptr.dev).

## Installation

```shell
$ npm install m2i

# or yarn
$ yarn add m2i
```

## CLI Usage

Use npx:

```shell
$ npx m2i <input> [options]
```

Globally install:

```shell
$ npm install m2i -g
# or yarn
$ yarn global add m2i
```

```shell
$ m2i --help
m2i/0.4.0

Usage:
  $ m2i <input>

Commands:
  <input>  Convert markdown to image

For more info, run any command with the `--help` flag:
  $ m2i --help

Options:
  -o, --output <output>  Output filename
  -w, --width <width>    Output image width
  -s, --scale <scale>    Device scale factor
  -p, --pdf              Output pdf
  -h, --help             Display this message
  -v, --version          Display version number

Examples:
  $ m2i example.md -o output.png -w 500
  $ m2i example.md -o output.pdf -p
```

m2i will automatically find the chrome or edge installed on your computer.

You can also use `CHROMIUM_PATH` provides an executable chromium file path:

```shell
$ CHROMIUM_PATH="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" npx m2i README.md
```

## Advanced Usage

By default, the conversion process of markdown does not do extra things. If you want to change the output format, you can customize the template of markdown or HTML in the configuration file.

This is good for customizing some shared content, or import custom style file.

`.m2irc` example:

```yaml
# custom chromium executable path
chromium: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
# custom common shared content
markdown: |
  {{placeholder}}

  ## License

  Licensed under the MIT License.
# custom render html template
html: |
  <link rel="stylesheet" href="https://unpkg.com/github-markdown-css">
  <article class="markdown-body" style="padding: 2.5em">
    {{placeholder}}
  </article>
```

> `{{placeholder}}` will be replaced with the result.

This configuration file is loaded through [cosmoconfig](https://github.com/davidtheclark/cosmiconfig#explorersearch), so you can place the corresponding file according to its rules, such as `~/.m2irc`.

## Recipes

### Code highlighting

Code highlighting through [Prism](https://prismjs.com).

.m2irc

```yaml
html: |
  <link rel="stylesheet" href="https://unpkg.com/github-markdown-css">
  <link rel="stylesheet" href="https://unpkg.com/prismjs/themes/prism-okaidia.css">
  <article class="markdown-body" style="padding: 2.5em">{{placeholder}}</article>
  <script src="https://unpkg.com/prismjs"></script>
```

### Custom styles

.m2irc

```yaml
html: |
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-sans: 'Noto Sans SC', sans-serif;
      --body-width: 45em;
      --body-bg: #f3f2ee;
      --body-color: #1f0909;
    }
    body {
      margin: 0 auto;
      padding: 3em 2.5em;
      max-width: var(--body-width);
      background: var(--body-bg);
      color: var(--body-color);
      font-family: var(--font-sans);
    }
    a {
      color: var(--link-color);
      text-decoration: none;
    }
  </style>
  <div>{{placeholder}}</div>
```

## API Usage

```javascript
const m2i = require('m2i')

// readme.md => readme.png
const result = await m2i('./readme.md')
// result => 'readme.png'

// more options
await m2i('./readme.md', {
  output: './foo.png', // output filename
  width: 800, // viewport width
  scale: 1 // device scale factor
})
```

## References

### m2i(input, options?)

#### input

- Type: `string`
- Details: markdown file path

#### options

##### output

- Type: `string`
- Details: output image path
- Default: `'<input_basename>.png'`

##### width

- Type: `number`
- Details: output image width, viewport width
- Default: `600`

##### scale

- Type: `number`
- Details: output image scale, device scale factor
- Default: `2`

##### pdf

- Type: `boolean`
- Details: pdf mode, output pdf file
- Default: `false`

## Related

- [zce/m2i-server](https://github.com/zce/m2i-server) - A service to convert markdown to image.

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)



[actions-img]: https://img.shields.io/github/workflow/status/zce/m2i/CI
[actions-url]: https://github.com/zce/m2i/actions
[codecov-img]: https://img.shields.io/codecov/c/github/zce/m2i
[codecov-url]: https://codecov.io/gh/zce/m2i
[license-img]: https://img.shields.io/github/license/zce/m2i
[license-url]: https://github.com/zce/m2i/blob/master/LICENSE
[downloads-img]: https://img.shields.io/npm/dm/m2i
[downloads-url]: https://npm.im/m2i
[version-img]: https://img.shields.io/npm/v/m2i
[version-url]: https://npm.im/m2i
[dependency-img]: https://img.shields.io/david/zce/m2i
[dependency-url]: https://david-dm.org/zce/m2i
[devdependency-img]: https://img.shields.io/david/dev/zce/m2i
[devdependency-url]: https://david-dm.org/zce/m2i?type=dev
[style-img]: https://img.shields.io/badge/code_style-standard-brightgreen
[style-url]: https://standardjs.com
