import fs from 'fs/promises'
import { cosmiconfig } from 'cosmiconfig'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('../package.json')

/**
 * Checks whether something exists on given path.
 * @param input input path
 */
export const exists = async (input: string): Promise<false | 'file' | 'dir' | 'other'> => {
  try {
    const stat = await fs.stat(input)
    /* istanbul ignore else */
    if (stat.isDirectory()) {
      return 'dir'
    } else if (stat.isFile()) {
      return 'file'
    } else {
      return 'other'
    }
  } catch (err) {
    /* istanbul ignore if */
    if (err.code !== 'ENOENT') {
      throw err
    }
    return false
  }
}

/**
 * Read file as a string.
 * @param input file name
 */
export const read = async (input: string): Promise<string> => {
  return await fs.readFile(input, 'utf8')
}

export interface Config {
  markdown: string
  html: string
}

export const placeholder = '{{placeholder}}'

/**
 * Get module config
 */
export const getConfig = async (): Promise<Config> => {
  const explorer = cosmiconfig(name)
  const { config } = await explorer.search(process.cwd()) ?? {}

  const defaults: Config = {
    markdown: placeholder,
    html: `<link rel="stylesheet" href="https://cdn.zce.me/markdown.css">${placeholder}`
  }

  return { ...defaults, ...config }
}
