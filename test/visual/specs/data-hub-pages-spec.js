const assert = require('assert')

describe('Visual Test', () => {
  it('home page - content', async () => {
    await browser.url('')
    await browser.imageDiff.takeElement('.grid-row')
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('home page - header', async () => {
    await browser.url('')
    await browser.imageDiff.takeElement('.datahub-header')
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('contage page', async () => {
    await browser.url('/contacts')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('companies page', async () => {
    await browser.url('/companies')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('interaction page', async () => {
    await browser.url('/interactions')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('investment page', async () => {
    await browser.url('/investments/projects')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('omis page', async () => {
    await browser.url('/omis')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })

  it('event page', async () => {
    await browser.url('/events')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })
})
