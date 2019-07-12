const assert = require('assert')

describe('Visual Test', () => {
  it('should visually check data hub home page is correct', async () => {
    await browser.url('')
    await browser.imageDiff.take()
    await browser.imageDiff.validate().then(result => {
      assert.equal(result, 0)
    })
  })
})
