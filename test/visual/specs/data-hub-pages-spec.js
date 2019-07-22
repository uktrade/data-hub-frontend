const assert = require('assert')

describe('Data Hub core pages', () => {
  it('should visually check data hub home page is correct', async () => {
    await browser.url('')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should validate contacts page is visually correct', async () => {
    await browser.url('/contacts')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should validate companies page is visually correct', async () => {
    await browser.url('/companies')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should validate interactions page is visually correct', async () => {
    await browser.url('/interactions')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should validate investments page is visually correct', async () => {
    await browser.url('/investments/projects')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('should validate orders page is visually correct', async () => {
    await browser.url('/omis')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })
})
