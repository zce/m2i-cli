import cac from 'cac'
import ora from 'ora'
import { relative } from 'path'

import m2i from '.'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../package.json')

// Unified error handling
/* istanbul ignore next */
const onError = (err: Error): void => {
  console.error(err.message)
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

const cli = cac(name as string)

cli
  .command('<input>', 'Convert markdown to image')
  .option('-o, --output <output>', 'Output filename')
  .option('-w, --width <width>', 'Output image width')
  .option('-s, --scale <scale>', 'Device scale factor')
  .example(`  $ ${name as string} example.md -o output.png -w 500`)
  .action((input, { output, width, scale }) => {
    if (typeof output !== 'string' && typeof output !== 'undefined') {
      throw new TypeError(`Expected output is a string, got ${typeof output}`)
    }
    if (typeof width !== 'number' && typeof width !== 'undefined') {
      throw new TypeError(`Expected width is a number, got ${typeof width}`)
    }
    if (typeof scale !== 'number' && typeof scale !== 'undefined') {
      throw new TypeError(`Expected scale is a number, got ${typeof scale}`)
    }

    const start = Date.now()
    const spinner = ora('Image generating...').start()

    m2i(input, { output, width, scale })
      .then(result => spinner.succeed(
        `Image generated → ${relative(process.cwd(), result)} (${((Date.now() - start) / 1000).toFixed(2)}s)`
      ))
      .catch(err => {
        spinner.fail(err.message)
      })
  })

cli.help().version(version).parse()
