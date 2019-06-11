const assert = require('assert')

describe('Visual Test', () => {
  it('should visually check data hub home page is correct', async () => {
    const testName = `Home Page - ${browser.capabilities.browserName}`
    await browser.url('')
    await browser.imageDiff.take(testName)
    await browser.imageDiff.validate(testName).then(result => {
      assert.equal(result, 0)
    })
  })
})
