const assert = require('assert')

describe('Data Hub', () => {
  describe('home page', () => {
    before(async () => {
      await browser.url('')
    })

    it('content', async () => {
      // Wait for the initial list to be loaded
      await $('=Edit list name')
      await browser.imageDiff.hideElement('.dashboard-section__info-feed-date')
      await browser.imageDiff.takeElement('.grid-row')
      const result = await browser.imageDiff.validate()
      assert.equal(result, 0)
    })

    it('header', async () => {
      await browser.imageDiff.takeElement('.datahub-header')
      const result = await browser.imageDiff.validate()
      assert.equal(result, 0)
    })

    it('search bar', async () => {
      await browser.imageDiff.takeElement('.govuk-grid-column-full')
      const result = await browser.imageDiff.validate()
      assert.equal(result, 0)
    })
  })

  it('contacts page', async () => {
    await browser.url('/contacts')
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('companies page', async () => {
    await browser.url('/companies')
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('interactions page', async () => {
    await browser.url('/interactions')
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('investments page', async () => {
    await browser.url('/investments/projects')
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('omis page', async () => {
    await browser.url('/omis')
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })

  it('events page', async () => {
    await browser.url('/events')
    await browser.imageDiff.take()
    const result = await browser.imageDiff.validate()
    assert.equal(result, 0)
  })
})
