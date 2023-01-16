import { join } from 'path'
import readdirRecursive from 'fs-readdir-recursive'
import {
  imageExt,
  textFileExt,
  logger,
  findDuplicates,
  textFilename,
  getImagesNameByReadingTextFile,
  findAndCopy
} from '../src/index'

describe('Image Search', () => {
  const imagesList = ['_A000.JPG', 'C000.JPG']
  const sourceLocation = join(process.cwd(), 'mocks', 'data')
  const unzipLocation = join(process.cwd(), 'mocks', 'data', 'unzip')
  const shortlistLocation = join(process.cwd(), 'mocks', 'data', 'shortlist')

  beforeEach(() => {
    vi.resetModules()
  })

  vi.mock('./constants', () => ({
    imageExt: '.jpg',
    textFileExt: '.txt',
    textFilename: 'mock_image_names',
    sourceLocation,
    unzipLocation,
    shortlistLocation
  }))

  it('extension', () => {
    expect(imageExt).toEqual('.JPG')
    expect(textFileExt).toEqual('.txt')
  })

  it('directory', () => {
    expect(sourceLocation).toContain('data')
    expect(unzipLocation).toContain('unzip')
    expect(shortlistLocation).toContain('shortlist')
  })

  describe('logger', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('log - without show time', () => {
      const logSpy = vi.spyOn(console, 'log')
      logger({
        message: 'foo',
        method: 'log'
      })
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO] foo'))
    })

    it('log - with show time', () => {
      const logSpy = vi.spyOn(console, 'log')
      logger({
        showTime: true,
        message: 'bar',
        method: 'log'
      })
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `[${new Date().toString().slice(0, 24)}][INFO] bar`
        )
      )
    })

    it('error - without show time', () => {
      const logSpy = vi.spyOn(console, 'error')
      logger({
        message: 'bar',
        method: 'error'
      })
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] bar')
      )
    })

    it('error - with show time', () => {
      const logSpy = vi.spyOn(console, 'error')
      logger({
        showTime: true,
        message: 'bar',
        method: 'error'
      })
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `[${new Date().toString().slice(0, 24)}][ERROR] bar`
        )
      )
    })
  })

  it('find duplicate', () => {
    expect(findDuplicates(['a', 'b', 'a'])).toStrictEqual(['a'])
    expect(findDuplicates(['a', 'b', 'c'])).toStrictEqual([])
    expect(findDuplicates(['a.jpg', 'b.png', 'c.png', 'a.jpg'])).toStrictEqual([
      'a.jpg'
    ])
  })

  it('getImagesNameByReadingTextFile', () => {
    const images = getImagesNameByReadingTextFile(
      imageExt,
      textFileExt,
      textFilename,
      sourceLocation
    )
    expect(images.length).toBe(2)
    expect(images.sort()).toStrictEqual(imagesList.sort())
  })

  it('findAndCopy', async () => {
    const status = await findAndCopy(
      unzipLocation,
      shortlistLocation,
      imagesList
    )
    expect(status).toBeTruthy()
    expect(readdirRecursive(shortlistLocation).sort()).toEqual(
      imagesList.sort()
    )
  })
})
