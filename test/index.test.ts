import readdirRecursive from 'fs-readdir-recursive'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import rimraf from 'rimraf'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  findAndCopy,
  getDocumentNameByReadingTextFile,
  getTextFromImage
} from '../src/index'

describe('docufilter', () => {
  const documentList = ['_A000.jpg', 'C000.jpg']
  const documentExt = '.jpg'
  const textFilename = 'file_names.txt'
  const sourceDirectory = join(process.cwd(), 'test', '__fixtures__', 'data')
  const sourceLocation = join(
    process.cwd(),
    'test',
    '__fixtures__',
    'data',
    'unzip'
  )
  const destinationLocation = join(
    process.cwd(),
    'test',
    '__fixtures__',
    'data',
    'shortlist'
  )

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(async () => {
    await rimraf(destinationLocation, {})
    await mkdir(destinationLocation)
  })

  it('filename & extension', () => {
    expect(documentExt).toEqual('.jpg')
    expect(textFilename).toEqual('file_names.txt')
  })

  it('directory', () => {
    expect(sourceDirectory).toContain('data')
    expect(sourceLocation).toContain('unzip')
    expect(destinationLocation).toContain('shortlist')
  })

  describe('getTextFromImage', () => {
    const timeout = 20000
    const staticImagesLocation = join(
      process.cwd(),
      'test',
      '__fixtures__',
      'images'
    )
    it(
      'HTTP URL',
      async () => {
        expect(
          await getTextFromImage(
            'https://tesseract.projectnaptha.com/img/eng_bw.png'
          )
        ).toMatchSnapshot()
      },
      timeout
    )

    it(
      'static image',
      async () => {
        expect(
          await getTextFromImage(join(staticImagesLocation, 'image-1.jpg'))
        ).toMatchSnapshot()
        expect(
          await getTextFromImage(join(staticImagesLocation, 'image-2.png'))
        ).toMatchSnapshot()
      },
      timeout
    )
  })

  it('getDocumentNameByReadingTextFile', () => {
    const images = getDocumentNameByReadingTextFile(
      documentExt,
      textFilename,
      sourceDirectory
    )
    expect(images.length).toBe(2)
    expect(images.sort()).toStrictEqual(documentList.sort())
  })

  it('findAndCopy', async () => {
    const status = await findAndCopy(
      sourceLocation,
      destinationLocation,
      documentList
    )
    expect(status).toBeTruthy()
    expect(readdirRecursive(destinationLocation).sort()).toEqual(
      documentList.sort()
    )
  })
})
