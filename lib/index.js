/* eslint-disable no-new-func, no-template-curly-in-string */

const fs = require('fs')
const path = require('path')
const marked = require('marked')
const matter = require('gray-matter')
const puppeteer = require('puppeteer')
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
 * Entry function
 * @param {string} filename markdown file path
 * @param {Object} option output image path
 * @param {string} option.output output image path
 * @param {number} option.width output image width
 */
const generateImage = async (filename, { output, width }) => {
  const templates = loadTemplates()
  const document = fs.readFileSync(filename, 'utf8')
  const { content } = matter(document)
  const markdown = templates.markdown({ content })
  const result = marked(markdown)
  const html = templates.html({ content: result })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width, height: 80 })
  await page.setContent(html)
  await page.screenshot({ path: output, fullPage: true })

  await browser.close()
}

/**
 * Entry function
 * @param {string} input markdown file path
 * @param {Object} option output image path
 * @param {string} option.output output image path, default: '<input>.png'
 * @param {number} option.width output image width, default: 800
 */
module.exports = async (input, { output, width }) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}: ${input}`)
  }

  const filename = path.resolve(input)

  const stats = fs.statSync(filename)
  if (!stats.isFile()) {
    throw new Error('Expected a filename, got dirname')
  }

  output = output || input.replace(path.extname(input), '.png')
  width = parseInt(width) || 800

  const start = new Date()

  await generateImage(filename, { output, width })

  const end = new Date()

  console.log(`${input} → ${output} (${end - start}ms)`)
}
