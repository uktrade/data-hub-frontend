const { parseFlashMessages } = require('../user-locals')

describe('parseFlashMessages', () => {
  it('valid JSON in success:with-body', () => {
    const BODY = { heading: 'foo bar', body: 'baz bing' }
    const RAW_FLASH_MESSAGES = {
      success: ['foo', '{"test":1}'],
      error: ['bar', 'baz'],
      'success:with-body': [JSON.stringify(BODY)],
    }

    expect(parseFlashMessages(RAW_FLASH_MESSAGES)).to.deep.equal({
      ...RAW_FLASH_MESSAGES,
      'success:with-body': [BODY],
    })
  })

  it('invalid JSON in success:with-body', () => {
    const RAW_FLASH_MESSAGES = {
      success: ['foo', '{"test":1}'],
      error: ['bar', 'baz'],
      'success:with-body': ["I'm no valid JSON"],
    }

    expect(parseFlashMessages(RAW_FLASH_MESSAGES)).to.deep.equal(
      RAW_FLASH_MESSAGES
    )
  })
})
