#!/usr/bin/env node

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

m2i(input, { output, width }).catch(e => {
  console.error(e)
  // error exit
  process.exit(1)
})
