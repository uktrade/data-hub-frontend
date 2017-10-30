module.exports = {
  elements: {
    flashMessage: '.c-message-list li:first-child',
  },

  commands: [
    {
      verifyMessage (messageType) {
        return this
          .waitForElementPresent('@flashMessage')
          .assert.cssClassPresent('@flashMessage', `c-message--${messageType}`)
      },
    },
  ],
}
