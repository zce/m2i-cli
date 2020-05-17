#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const pkg = require('../package')
const m2i = require('..')

program
  .version(pkg.version)
  .usage('<input>')
  .option('-o, --output <output>', 'output filename')
  .option('-w, --width <width>', 'output image width')
  .on('--help', () => {
    console.log()
    console.log('Example:')
    console.log('  $ m2i example.md -o output.png -w 800')
  })
  .parse(process.argv)
  .args.length || program.help()

const { args, output, width } = program
const [input] = args

const main = async () => {
  const start = new Date()
  const img = await m2i(input, { output, width })
  const end = new Date()
  console.log(
    `Image generated → ${path.relative(process.cwd(), img)} (${end - start}ms)`
  )
}

main().catch(e => {
  console.error(e.message)
  process.exit(1)
})
