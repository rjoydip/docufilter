import { createWorker } from 'tesseract.js'

;(async () => {
  const worker = await createWorker({
    // eslint-disable-next-line no-console
    logger: (m) => console.log(m)
  })

  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  const {
    data: { text }
  } = await worker.recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png'
  )
  // eslint-disable-next-line no-console
  console.log('[Text]: ', text)
  await worker.terminate()
})()
