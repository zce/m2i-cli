# m2i

[![Build Status][travis-img]][travis-url]
[![Coverage Status][codecov-img]][codecov-url]
[![License][license-img]][license-url]
[![NPM Downloads][downloads-img]][downloads-url]
[![NPM Version][version-img]][version-url]
[![Dependency Status][dependency-img]][dependency-url]
[![devDependency Status][devdependency-img]][devdependency-url]
[![Code Style][style-img]][style-url]

> A minimalist markdown to image converter, built with puppeteer.

## Installation

```shell
$ npm install m2i

# or yarn
$ yarn add m2i
```

> People in China can use `npm.taobao.org` mirror to increase installation speed.
>
> .npmrc
>
> ```ini
> # other configs
> puppeteer_download_host = https://npm.taobao.org/mirrors
> ```
>
> or env
>
> ```shell
> $ PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors npm i m2i
> ```

## Usage

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

## API

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
m2i/0.1.0

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
  -h, --help             Display this message
  -v, --version          Display version number

Examples:
  $ m2i example.md -o output.png -w 500
```

## Advanced Usage

By default, the conversion process of markdown does not do extra things. If you want to change the output format, you can customize the template of markdown or HTML in the configuration file.

This is good for customizing some shared content, or import custom style file.

.m2irc example:

```yaml
markdown: |
  {{placeholder}}

  ## License

  Licensed under the MIT License.
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

### Custom CSS


.m2irc

```yaml
html: |
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-sans: system-ui, 'Noto Sans SC', sans-serif;
      --font-serif: Georgia, 'Noto Serif SC', serif;
      --font-mono: 'Fira Code', monospace;
      --body-width: 45em;
      --body-bg: #f3f2ee;
      --body-color: #1f0909;
      --border: #c9cbc6;
      --block-bg: #edece8;
      --link-color: #228be6;
    }
    body {
      margin: 0 auto;
      padding: 3em 2.5em;
      max-width: var(--body-width);
      background: var(--body-bg);
      color: var(--body-color);
      font-size: 16px;
      line-height: 1.75;
      font-weight: 400;
      font-family: var(--font-sans);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.2;
    }
    h1 {
      margin-top: .67em;
      margin-bottom: .67em;
      padding-bottom: .5em;
      border-bottom: 1px solid var(--border);
      font-size: 2.5em;
      font-weight: bold;
    }
    h2 {
      margin-top: .83em;
      margin-bottom: .83em;
      font-size: 2em;
      font-weight: bold;
    }
    h3 {
      margin-top: 1em;
      margin-bottom: 1em;
      font-size: 1.75em;
      font-weight: bold;
    }
    h4 {
      margin-top: 1.33em;
      margin-bottom: 1.33em;
      font-size: 1.5em;
      font-weight: bold;
    }
    h5 {
      margin-top: 1.67em;
      margin-bottom: 1.67em;
      font-size: 1.25em;
      font-weight: bold;
    }
    h6 {
      margin-top: 2.33em;
      margin-bottom: 2.33em;
      font-size: 1em;
      font-weight: bold;
    }
    hr {
      border: 0;
      height: 1px;
      background: var(--border);
    }
    ul, ol {
      position: relative;
      padding-left: 2.5em;
    }
    li ol > li {
      list-style-type: lower-alpha;
    }
    li li ol > li {
      list-style-type: lower-roman;
    }
    table {
      margin: 1em 0;
      border-collapse: collapse;
      overflow: auto;
      width: 100%;
    }
    thead {
      background: var(--border);
      text-align: left;
    }
    tr:nth-of-type(2n) {
      background: var(--block-bg);
    }
    th, td {
      padding: .25em .5em;
    }
    blockquote {
      margin: 0;
      padding: 1em 1.25em;
      border-left: 5px solid var(--border);
      background: var(--block-bg);
    }
    blockquote > :last-child {
      margin-bottom: 0;
    }
    blockquote > :first-child {
      margin-top: 0;
    }
    blockquote ul, blockquote ol {
      padding-left: 1.5em;
    }
    pre {
      padding: 0;
      background: var(--block-bg);
    }
    code {
      font-size: 87.5%;
      font-family: var(--font-mono);
    }
    pre code {
      display: block;
      padding: 1em 1.25em;
      overflow: auto;
    }
    img {
      max-width: 100%;
    }
    a {
      color: var(--link-color);
      text-decoration: none;
    }
  </style>
  <div>{{placeholder}}</div>
```

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



[travis-img]: https://img.shields.io/travis/com/zce/m2i
[travis-url]: https://travis-ci.com/zce/m2i
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
