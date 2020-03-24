# m2i

[![Build Status][travis-image]][travis-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> A markdown to image parser

## Installation

```shell
$ yarn add m2i

# or npm
$ npm install m2i
```

> People in China can use `npm.taobao.org` to increase installation speed.

.npmrc

```ini
# other configs
puppeteer_download_host = https://npm.taobao.org/mirrors
```

or env

```shell
$ PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors npm i m2i
```

## Usage

```javascript
const m2i = require('m2i')

await m2i('./README.md')
// README.md => README.png

await m2i('./README.md', { 
  output: './foo.png', 
  width: 1280 
})
// README.md => foo.png
```

## API

### m2i(input[, options])

#### input

- Type: `string`
- Details: markdown file path

#### options

##### output

- Type: `string`
- Details: output image path

##### width

- Type: `string`
- Details: output image width
- Default: 800

## CLI Usage

```shell
$ npm install m2i -g

# or yarn 
$ yarn global add m2i
```

```shell
$ m2i --help
Usage: m2i <input>

Options:
  -V, --version          output the version number
  -o, --output <output>  output filename
  -w, --width <width>    image width
  -h, --help             display help for command

Example:
  $ m2i example.md -o output.png -w 800
```

or use npx

```shell
$ npx m2i example.md -o output.png -w 800
```

## Advanced Usage

By default, the conversion process of markdown does not do extra things. If you want to change the output format, you can customize the template of markdown or HTML in the configuration file.

This is good for customizing some shared content, or import custom style file.

.m2irc example:

```yaml
markdown: |
  ${content.trim()}

  ## License

  Licensed under the MIT License.
html: |
  <link rel="stylesheet" href="https://unpkg.com/github-markdown-css">
  <article class="markdown-body" style="padding: 2.5em">
  ${content.trim()}
  </article>
```

This configuration file is loaded through [cosmoconfig](https://github.com/davidtheclark/cosmiconfig#explorersearch), so you can place the corresponding file according to its rules, such as `~/.m2irc`.


## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; [汪磊](https://zce.me)



[travis-image]: https://img.shields.io/travis/zce/m2i.svg
[travis-url]: https://travis-ci.org/zce/m2i
[downloads-image]: https://img.shields.io/npm/dm/m2i.svg
[downloads-url]: https://npmjs.org/package/m2i
[version-image]: https://img.shields.io/npm/v/m2i.svg
[version-url]: https://npmjs.org/package/m2i
[license-image]: https://img.shields.io/github/license/zce/m2i.svg
[license-url]: https://github.com/zce/m2i/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/zce/m2i.svg
[dependency-url]: https://david-dm.org/zce/m2i
[devdependency-image]: https://img.shields.io/david/dev/zce/m2i.svg
[devdependency-url]: https://david-dm.org/zce/m2i?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
