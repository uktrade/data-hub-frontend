module.exports = {
  elements: {
    flashMessage: '.c-message',
  },

  commands: [
    {
      async verifyMessage(messageType, message) {
        await this.waitForElementPresent(
          '@flashMessage'
        ).assert.cssClassPresent('@flashMessage', `c-message--${messageType}`)

        if (message) {
          await this.assert.containsText('@flashMessage', message)
        }
      },
    },
  ],
}
