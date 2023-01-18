import intersection from 'array-intersection'
import { readFileSync } from 'fs'
import readdirRecursive from 'fs-readdir-recursive'
import { copyFile } from 'fs/promises'
import { basename, join } from 'path'
import { createWorker } from 'tesseract.js'

/**
 * This method scan a image and return text. The static image file types are 'jpg', 'png'
 *
 * @param {string} image - Image file (it can be URL and static file)
 * @param {string} language - Default - 'en'
 * @param {boolean} showLog - Default - false
 *
 * @returns {string}
 *
 * @example
 * ```ts
 * getTextFromImage('foo.png', '/path')
 * ```
 */
export const getTextFromImage = async (
  image: string,
  lang = 'eng',
  showLog = false
): Promise<string> => {
  const worker = await createWorker({
    // eslint-disable-next-line no-console
    logger: (m) => (showLog ? console.log(m) : void 0)
  })

  await worker.loadLanguage(lang)
  await worker.initialize(lang)

  const {
    data: { text }
  } = await worker.recognize(image)

  await worker.terminate()
  return text
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
