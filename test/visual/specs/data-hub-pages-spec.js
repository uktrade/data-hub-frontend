const assert = require('assert')

describe('Visual Test', () => {
  it('should visually check data hub home page is correct', async () => {
    await browser.url('')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should visually check data hub visual page is correct', async () => {
    await browser.url('/contacts')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should visually check data hub visual page is correct', async () => {
    await browser.url('/companies')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should visually check data hub visual page is correct', async () => {
    await browser.url('/interactions')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should visually check data hub visual page is correct', async () => {
    await browser.url('/investments/projects')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should visually check data hub visual page is correct', async () => {
    await browser.url('/omis')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })
})
