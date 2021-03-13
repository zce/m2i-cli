import path from 'path'
import marked from 'marked'
import puppeteer from 'puppeteer'
import { exists, read, placeholder, getConfig } from './utils'

export interface Options {
  output?: string
  width?: number
  scale?: number
}

export default async (input: string, options: Options = {}): Promise<string> => {
  const filename = path.resolve(input)
  const output = path.resolve(options.output ?? input.replace(/\.\S+$/, '.png'))
  const width = options.width ?? 600
  const deviceScaleFactor = options.scale ?? 2

  const exist = await exists(filename)

  if (exist === false) {
    throw new Error(`The specified input does not exist: ${input}`)
  }

  if (exist === 'dir' || exist === 'other') {
    throw new Error(`The specified input is not a file: ${input}`)
  }

  // read markdown doc content
  const document = await read(filename)

  // remove front matter if exists
  const content = document.replace(/^---$.*^---$\s*/ms, '')

  // get user config
  const config = await getConfig()

  // rendering markdown
  const markdown = config.markdown.replace(placeholder, content)
  const rendered = marked(markdown)
  const result = config.html.replace(placeholder, rendered)

  // capture screenshot
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(0)
  await page.setViewport({ width, height: 200, deviceScaleFactor })
  await page.setContent(result)
  await page.screenshot({ path: output, fullPage: true })
  await browser.close()

  return output
}
