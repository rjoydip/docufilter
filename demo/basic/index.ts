import * as dotenv from 'dotenv'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import rimraf from 'rimraf'

import { findAndCopy, getDocumentNameByReadingTextFile } from '../../src'

dotenv.config()
;(async () => {
  const fileLocation = resolve(process.env.FILE_LOCATION || '')
  const sourceLocation = resolve(process.env.SOURCE_LOCATION || '')
  const destinationLocation = resolve(process.env.DESTINATION_LOCATION || '')

  const cleanup = async () => {
    await rimraf(destinationLocation, {})
    await mkdir(destinationLocation)
  }

  const images = getDocumentNameByReadingTextFile(
    '.JPG',
    process.env.FILENAME || '',
    fileLocation
  )

  await cleanup()
  // eslint-disable-next-line no-console
  console.log('Cleanup done')

  await findAndCopy(sourceLocation, destinationLocation, images)
  // eslint-disable-next-line no-console
  console.log('File coping done')
})()
