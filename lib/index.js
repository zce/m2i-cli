/* eslint-disable no-new-func, no-template-curly-in-string */

const fs = require('fs')
const path = require('path')
const marked = require('marked')
const matter = require('gray-matter')
const puppeteer = require('puppeteer')
const replaceExt = require('replace-ext')
const { cosmiconfigSync } = require('cosmiconfig')

/**
 * Compile an ES6 template literals string to a Template function
 * @param {string} source ES6 template literals
 */
const compile = source => {
  return context => {
    const props = Object.keys(context).join(', ')
    return new Function(`{ ${props} }`, `return \`${source}\``)(context)
  }
}

/**
 * Get module config
 */
const getConfig = () => {
  const explorer = cosmiconfigSync('m2i')
  const { config = {} } = explorer.search(process.cwd()) || {}

  const defaults = {
    markdown: '${content}',
    html: '<link rel="stylesheet" href="https://unpkg.com/github-markdown-css"><div class="markdown-body" style="padding: 2.5em">${content.trim()}</div>'
  }

  return { ...defaults, ...config }
}

/**
 * Load config template
 */
const loadTemplates = () => {
  const { markdown, html } = getConfig()
  return {
    markdown: compile(markdown),
    html: compile(html)
  }
}

/**
 * Generate markdown image
 * @param {string} input markdown file path
 * @param {string} output output image path
 * @param {number} width output image width
 */
const generateImage = async (input, output, width) => {
  // read markdown content
  const document = fs.readFileSync(input, 'utf8')
  const { content } = matter(document)

  // apply template & parse markdown
  const templates = loadTemplates()
  const markdown = templates.markdown({ content })
  const result = marked(markdown)
  const html = templates.html({ content: result })

  // capture screenshot by puppeteer
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width, height: 80 })
  await page.setContent(html)
  await page.screenshot({ path: output, fullPage: true })
  await browser.close()

  return output
}

/**
 * Entry function
 * @param {string} input markdown file path
 * @param {Object} options output image options
 * @param {string} options.output output image path, default: '<input>.png'
 * @param {number} options.width output image width, default: 800
 */
module.exports = async (input, { output, width }) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}: ${input}`)
  }

  input = path.resolve(input)
  output = path.resolve(output || replaceExt(input, '.png'))
  width = parseInt(width) || 800

  // ensure file exists
  if (!fs.existsSync(input)) {
    throw new Error('The specified input path does not exist')
  }
  if (!fs.statSync(input).isFile()) {
    throw new Error('The specified input path is a directory')
  }

  // generate image
  return generateImage(input, output, width)
}
