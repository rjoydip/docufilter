import { readFileSync } from 'fs'
import { copyFile } from 'fs/promises'
import { basename, join } from 'path'
import intersection from 'array-intersection'
import readdirRecursive from 'fs-readdir-recursive'

export * from './constants'

export type LogMethods = 'log' | 'error'
export interface LogOptions {
  showTime?: boolean
  message: string
  method: LogMethods
}

/**
 * This method do console logging based on the options
 *
 * @param options - Logger options
 * @param {string} options.message - Logger message
 * @param {string} options.method - log or error
 * @param {boolean} options.showTime - Default: false
 *
 * @returns void
 *
 * @example
 * ```ts
 * logger({ message: 'foo', method: 'log' }) // => [INFO] foo
 * logger({ message: 'foo', method: 'error' }) // => [INFO] foo
 * logger({ showTime: true, message: 'foo', method: 'error' }) // => [Sun Jan 15 2023 14:15:50][INFO] foo
 * ```
 */
export const logger = (options: LogOptions): void => {
  const _options = Object.assign(
    {
      showTime: false,
      message: '',
      method: 'log'
    },
    options
  )
  let str = ''
  str += _options.showTime ? `[${new Date().toString().slice(0, 24)}]` : ''
  switch (_options.method) {
    case 'log':
      // eslint-disable-next-line no-console
      console.log(`${str}[INFO] ${_options.message.trim()}`)
      break
    case 'error':
      // eslint-disable-next-line no-console
      console.error(`${str}[ERROR] ${_options.message.trim()}`)
      break
    default:
      break
  }
}

/**
 * This method gives array of elements if there are any duplicates in array. Else it'll return empty array
 *
 * @param {string[]} arr - Array of images name (with or without extension)
 *
 * @returns {string[]} Image filename or Empty
 *
 * @example
 * ```ts
 * logger(['a', 'b', 'c', 'a']) // => ['a']
 * logger(['a.jpg', 'b.png', 'c.png', 'a.jpg']) // => ['a.jpg']
 * logger(['a', 'b', 'c']) // => []
 * ```
 */
export const findDuplicates = (arr: string[]): string[] => {
  const seen: {
    [key: string]: number | string | boolean
  } = {}
  const duplicates: string[] = []

  arr.forEach((item) => {
    if (seen[item]) {
      duplicates.push(item)
    } else {
      seen[item] = true
    }
  })

  return duplicates
}

/**
 * This method gives array of elements if there are any duplicates in array. Else it'll return empty array
 *
 * @param {string} imageExt - Image file extension
 * @param {string} textFileExt - Text file extension
 * @param {string} textFilename - Text filename where image file name written
 * @param {string} sourceLocation - Source location where images are there
 *
 * @returns {string[]} Array of filenames
 *
 * @example
 * ```ts
 * getImagesNameByReadingTextFile('.jpg', '.txt', 'foo', '/path') // => ['a.jpg', 'b.jpg']
 * ```
 */
export const getImagesNameByReadingTextFile = (
  imageExt: string,
  textFileExt: string,
  textFilename: string,
  sourceLocation: string
): string[] =>
  [
    ...new Set(
      readFileSync(join(sourceLocation, `${textFilename}${textFileExt}`))
        .toString()
        .split('|')
    )
  ].map((f) =>
    f.toLowerCase().includes(imageExt.toLowerCase())
      ? f.trim()
      : `${f.trim()}${imageExt}`
  )

/**
 * This method copy files from source directory and it's nested sub directory and copy those files to destination location
 *
 * @param {string} sourceLocation - Source location where files are there in either in directory or it's nested sub-directory
 * @param {string} destinationLocation - Destination location where files will be copied
 * @param {string[]} images - String of image name in array format
 *
 * @returns {Promise<boolean|unknown>} True: For successful copying, Error: for any error during coping
 *
 * @example
 * ```ts
 * findAndCopy('/src-path', '/dest-path', ['a.jpg', 'b.jpg']) // => True: For successful copying, Error: for any error during coping
 * ```
 */
export const findAndCopy = async (
  sourceLocation: string,
  destinationLocation: string,
  images: string[]
): Promise<boolean | unknown> => {
  try {
    const _imagesToLowerCase = images.map((i) => i.toLowerCase())
    return await Promise.all(
      readdirRecursive(sourceLocation).map(async (img) => {
        if (
          intersection(_imagesToLowerCase, [basename(img).toLowerCase()]).length
        ) {
          const filePath = join(sourceLocation, img)
          await copyFile(
            filePath,
            join(destinationLocation, basename(filePath))
          )
          return true
        }
        return false
      })
    )
  } catch (err) {
    return err
  }
}
