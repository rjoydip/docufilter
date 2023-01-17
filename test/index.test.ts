import readdirRecursive from 'fs-readdir-recursive'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import rimraf from 'rimraf'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  findAndCopy,
  findDuplicates,
  getDocumentNameByReadingTextFile,
  logger
} from '../src/index'

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

  describe('logger', () => {
    const shortTimeMsgRegx =
      /^(\[\d{4}-[01]\d-[0-3]\d\])\[(ERROR|INFO)\]\s(.+?)$/
    const longTimeMsgRegx =
      /^\[\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\]\[(ERROR|INFO)\]\s(.+?)$/

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('info - without show time', () => {
      const infoSpy = vi.spyOn(console, 'info')
      logger({
        message: 'foo',
        method: 'info'
      })
      expect(infoSpy).toHaveBeenCalledTimes(1)
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] foo')
      )
    })

    it('info - with show time', () => {
      const infoSpy = vi.spyOn(console, 'info')
      logger({
        showTime: true,
        message: 'bar',
        method: 'info'
      })
      expect(infoSpy).toHaveBeenCalledTimes(1)
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringMatching(longTimeMsgRegx)
      )
    })

    it('info - with show time (short)', () => {
      const infoSpy = vi.spyOn(console, 'info')
      logger({
        showTime: true,
        shortTime: true,
        message: 'bar',
        method: 'info'
      })
      expect(infoSpy).toHaveBeenCalledTimes(1)
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringMatching(shortTimeMsgRegx)
      )
    })

    it('error - without show time', () => {
      const infoSpy = vi.spyOn(console, 'error')
      logger({
        message: 'bar',
        method: 'error'
      })
      expect(infoSpy).toHaveBeenCalledTimes(1)
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] bar')
      )
    })

    it('error - with show time', () => {
      const infoSpy = vi.spyOn(console, 'error')
      logger({
        showTime: true,
        message: 'bar',
        method: 'error'
      })
      expect(infoSpy).toHaveBeenCalledTimes(1)
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringMatching(longTimeMsgRegx)
      )
    })

    it('error - with show time (short)', () => {
      const infoSpy = vi.spyOn(console, 'error')
      logger({
        showTime: true,
        shortTime: true,
        message: 'bar',
        method: 'error'
      })
      expect(infoSpy).toHaveBeenCalledTimes(1)
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringMatching(shortTimeMsgRegx)
      )
    })
  })

  it('find duplicate', () => {
    expect(findDuplicates(['a', 'b', 'a'])).toStrictEqual(['a'])
    expect(findDuplicates(['a', 'b', 'c'])).toStrictEqual([])
    expect(findDuplicates(['a.jpg', '_b.png', 'c.PNG', 'a.jpg'])).toStrictEqual(
      ['a.jpg']
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
