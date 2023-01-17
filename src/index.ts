import intersection from 'array-intersection'
import { readFileSync } from 'fs'
import readdirRecursive from 'fs-readdir-recursive'
import { copyFile } from 'fs/promises'
import { basename, join } from 'path'

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
 * logger({ message: 'foo', method: 'info' }) // => [INFO] foo
 * logger({ message: 'foo', method: 'error' }) // => [ERROR] foo
 * logger({ showTime: true, message: 'foo', method: 'info' }) // => [Sun Jan 15 2023 14:15:50][INFO] foo
 * logger({ showTime: true, message: 'foo', method: 'error' }) // => [2023-01-17T05:45:38.186Z][ERROR] foo
 * logger({ showTime: true, shortTime: true message: 'foo', method: 'error' }) // => [2023-01-17][ERROR] foo
 * ```
 */
export const logger = ({
  showTime = false,
  shortTime = false,
  message = '',
  method = 'info'
}: {
  showTime?: boolean
  shortTime?: boolean
  message?: string
  method?: 'info' | 'error'
}): void => {
  const time = new Date().toISOString()
  switch (method) {
    case 'info':
      // eslint-disable-next-line no-console
      console.info(
        `${
          showTime ? `[${shortTime ? time.slice(0, 10) : time}]` : ''
        }[INFO] ${message.trim()}`
      )
      break
    case 'error':
      // eslint-disable-next-line no-console
      console.error(
        `${
          showTime ? `[${shortTime ? time.slice(0, 10) : time}]` : ''
        }[ERROR] ${message.trim()}`
      )
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
 * findDuplicates(['a', 'b', 'c', 'a']) // => ['a']
 * findDuplicates(['a.jpg', 'b.png', 'c.png', 'a.jpg']) // => ['a.jpg']
 * findDuplicates(['a', 'b', 'c']) // => []
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
 * @param {string} documentExt - Image file extension
 * @param {string} textFilename - Text filename where image file name written
 * @param {string} sourceDirectory - Source location where images are there
 *
 * @returns {string[]} Array of filenames
 *
 * @example
 * ```ts
 * getDocumentNameByReadingTextFile('.jpg', 'foo.txt', '/path') // => ['a.jpg', 'b.jpg']
 * ```
 */
export const getDocumentNameByReadingTextFile = (
  documentExt: string,
  textFilename: string,
  sourceDirectory: string
): string[] =>
  [
    ...new Set(
      readFileSync(join(sourceDirectory, `${textFilename}`))
        .toString()
        .split('|')
    )
  ].map((f) =>
    f.toLowerCase().includes(documentExt.toLowerCase())
      ? f.trim()
      : `${f.trim()}${documentExt}`
  )

/**
 * This method copy files from source directory and it's nested sub directory and copy those files to destination location
 *
 * @param {string} sourceDirectory - Source location where files are there in either in directory or it's nested sub-directory
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
  sourceDirectory: string,
  destinationLocation: string,
  images: string[]
): Promise<boolean | unknown> => {
  try {
    const _imagesToLowerCase = images.map((i) => i.toLowerCase())
    return await Promise.all(
      readdirRecursive(sourceDirectory).map(async (img) => {
        if (
          intersection(_imagesToLowerCase, [basename(img).toLowerCase()]).length
        ) {
          const filePath = join(sourceDirectory, img)
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
