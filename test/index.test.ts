import readdirRecursive from 'fs-readdir-recursive'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import rimraf from 'rimraf'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { findAndCopy, getDocumentNameByReadingTextFile } from '../src/index'

describe('Image Search', () => {
  const documentList = ['_A000.jpg', 'C000.jpg']
  const documentExt = '.jpg'
  const textFilename = 'mock_image_names.txt'
  const sourceDirectory = join(process.cwd(), '_mocks_', 'data')
  const sourceLocation = join(process.cwd(), '_mocks_', 'data', 'unzip')
  const destinationLocation = join(
    process.cwd(),
    '_mocks_',
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
    expect(textFilename).toEqual('mock_image_names.txt')
  })

  it('directory', () => {
    expect(sourceDirectory).toContain('data')
    expect(sourceLocation).toContain('unzip')
    expect(destinationLocation).toContain('shortlist')
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
