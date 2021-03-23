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
  chromium: string
}

export const placeholder = '{{placeholder}}'

/**
 * Get module config
 */
export const getConfig = async (): Promise<Config> => {
  const explorer = cosmiconfig(name)
  const { config } = await explorer.search(process.cwd()) ?? {}

  const getChromiumPath = async (): Promise<string> => {
    const chromiumPath = process.env.CHROMIUM_PATH
    if (chromiumPath != null && chromiumPath !== '') return chromiumPath

    // find in config file
    if (config?.chromium != null && config.chromium !== '') return config.chromium

    const platform = process.platform as 'win32' | 'darwin' | 'linux'

    const chromePath = {
      win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      linux: '/usr/bin/google-chrome'
    }[platform]

    if (await exists(chromePath) === 'file') return chromePath

    const edgePath = {
      win32: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      darwin: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      linux: '/usr/bin/microsoft-edge'
    }[platform]

    if (await exists(edgePath) === 'file') return edgePath

    throw new Error('Unable to find executable chromium, Please use the `CHROMIUM_PATH` env to provide an executable path.')
  }

  const defaults = {
    markdown: placeholder,
    html: `<link rel="stylesheet" href="https://cdn.zce.me/markdown.css">${placeholder}`
  }

  return { ...defaults, ...config, chromium: await getChromiumPath() }
}
